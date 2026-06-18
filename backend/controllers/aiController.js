const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const Progress = require('../models/Progress');


// ─── Smart Local Coaching Engine (Fallback) ──────────────────────────────────
function localCoach(prompt) {
  const text = prompt.trim();
  const words = text.split(/\s+/).length;
  
  let response = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  response += `👋 **LinguaCoach AI (Offline Mode)**\n\n`;
  response += `I analyzed your message ("${text}"). Since I'm currently in a limited offline mode, I can't provide a deep linguistic analysis yet.\n\n`;
  
  if (words < 3) {
    response += `🗣️ It looks like a short greeting or phrase. Try writing a full sentence for better practice!\n\n`;
  } else {
    response += `📝 Great effort on that sentence! I've noted it for when my AI engine is fully back online.\n\n`;
  }

  response += `⚠️ **System Note:** Gemini AI is not responding. This usually means the API key in \`.env\` is either invalid, expired, or has reached its free tier limit.\n\n`;
  response += `📊 Your current level: B1 (Intermediate)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  return {
    message: response,
    metrics: { Grammar: 60, Logic: 60, Persuasion: 60 }
  };
}

// ─── Main Controller ─────────────────────────────────────────────────────────
const chatWithAI = async (req, res) => {
  const { prompt, imageBase64, imageMimeType, mode, language } = req.body;
  const userId = req.user?.id;

  try {
    // 1. Fetch User Context for Personalization
    let userContext = "";
    if (userId) {
      const user = await User.findById(userId);
      const progress = await Progress.findOne({ user: userId });
      
      if (user) {
        userContext = `
[USER MEMORY]
- User Name: ${user.name}
- Native: ${user.nativeLanguage} | Learning: ${user.targetLanguage}
- Level: ${user.proficiencyLevel}
- Experience: ${user.totalXP} XP | Streak: ${user.streak} days
${progress && progress.pastMistakes?.length > 0 ? `- Recent Errors: ${progress.pastMistakes.slice(-3).map(m => m.error).join(', ')}` : ""}
`;
      }
    }

    const personality = req.body.personality || 'Friendly Buddy';
    const sessionMode = mode || 'Casual Conversation';
    const targetLang = language || 'English';

    // 2. LINGUACOACH AI MASTER INSTRUCTIONS (PREMIUM EDITION)
    const masterInstruction = `
You are LinguaCoach AI — an elite, multi-lingual language intelligence coach.
Your current personality profile is: **${personality}**.
The session mode is: **${sessionMode}**.

Your mission is to help users master ${targetLang} (or any language they speak) with precision and natural fluency.

${userContext}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 CORE BEHAVIOR & INTELLIGENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. **Personality Alignment**: Adapt your tone to be ${personality === 'Strict Teacher' ? 'professional, rigorous, and focused on formal accuracy' : 'supportive, casual, and focused on practical communication'}.
2. **Mode Awareness**: If in 'Roleplay' or 'Interview' mode, stay in character. If the user stops the roleplay, transition back to coach mode.
3. **Language Detection**: You are a native speaker of ALL languages. Respond in the language the user is practicing, but provide translations or explanations in their native language if they seem stuck.
4. **Strict Correction**: If the user makes ANY mistake (grammar, spelling, syntax, or unnatural phrasing), you MUST point it out politely.
5. **Suggestions**: Provide 2-3 better or more natural ways to say what the user intended.
6. **Practice Mode**: Encourage the user to use new vocabulary or grammar points.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 RESPONSE STRUCTURE (MANDATORY MARKDOWN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Always use this structure for your replies:

### [Emoji] LinguaCoach Insight (${personality})
[Your main response/answer here. Keep it encouraging and high-quality.]

---
#### 📝 Correction & Analysis
[If no mistakes: "Your sentence is perfect! No corrections needed."]
[If mistakes: 
✅ **Correction**: [Corrected version]
💡 **Why?**: [Simple linguistic explanation]
🗣️ **Natural Phrasing**: [How a native would say it]]

---
#### 🚀 Suggestions for Practice
- [Suggestion 1: e.g., "Try using the word 'X' instead of 'Y'"]
- [Suggestion 2: e.g., "Ask me about [Topic] to practice [Grammar Point]"]

---
📊 **Level Progress**: [Level Name] (${userContext ? "XP Awarded!" : "Sign in to track XP"})
⭐ **Daily Tip**: [A quick tip about ${targetLang} culture or grammar]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
METRICS (HIDDEN DATA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALWAYS end your response with this exact block for the system to process:
---METRICS---
Grammar: [0-100]
Logic: [0-100]
Persuasion: [0-100]
`;

    // 3. Handle prompt dynamically
    let finalPrompt = prompt;

    const fullPrompt = `${masterInstruction}\n\nUser Input: ${finalPrompt}`;

    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`[AI CHAT] Request received. Key detected: ${apiKey ? apiKey.substring(0, 8) + '...' : 'NONE'}`);
    
    if (apiKey) {
      console.log(`[AI CHAT] Using Gemini API Key: ${apiKey.substring(0, 5)}...`);
      const genAI = new GoogleGenerativeAI(apiKey);
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const contentParts = [fullPrompt];
        
        if (imageBase64) {
          contentParts.push({
            inlineData: { data: imageBase64, mimeType: imageMimeType || 'image/jpeg' }
          });
        }

        const result = await model.generateContent(contentParts);
        const responseText = result.response.text();

        if (responseText) {
          let message = responseText;
          let metrics = { Grammar: 75, Logic: 75, Persuasion: 75 };

          if (responseText.includes('---METRICS---')) {
            const parts = responseText.split(/---METRICS---/i);
            message = parts[0].trim();
            if (parts[1]) {
              metrics.Grammar = parseInt(parts[1].match(/Grammar:\s*(\d+)/i)?.[1] || 75);
              metrics.Logic = parseInt(parts[1].match(/Logic:\s*(\d+)/i)?.[1] || 75);
              metrics.Persuasion = parseInt(parts[1].match(/Persuasion:\s*(\d+)/i)?.[1] || 75);
            }
          }

          // XP & Mistake Tracking
          if (userId) {
            await User.findByIdAndUpdate(userId, { $inc: { totalXP: 10 } });
            
            if (message.includes('✅ Correction:')) {
               try {
                  const corrMatch = message.match(/✅ Correction:\s*(.*)/i);
                  const expMatch = message.match(/💡 Explanation:\s*(.*)/i);
                  if (corrMatch) {
                    await Progress.findOneAndUpdate(
                      { user: userId },
                      { 
                        $push: { pastMistakes: { error: prompt, correction: corrMatch[1], explanation: expMatch ? expMatch[1] : "" } },
                        $setOnInsert: { targetLanguage: targetLang }
                      },
                      { upsert: true }
                    );
                  }
               } catch (e) { console.warn("Mistake logging failed"); }
            }
          }

          return res.json({ success: true, data: message, metrics });
        }
      } catch (apiErr) {
        console.error('GEMINI API ERROR:', apiErr.message);
        // If quota exceeded, show a clear message instead of silent fallback
        if (apiErr.message && apiErr.message.includes('429')) {
          return res.json({ 
            success: true, 
            data: `⚠️ **API Quota Exceeded**\n\nYour Gemini API free tier limit has been reached for today.\n\n**Fix:** Go to [Google AI Studio](https://aistudio.google.com/apikey) and generate a new API key, then update your \`backend/.env\` file.\n\nYour code is working perfectly — this is only an API quota issue!`, 
            metrics: { Grammar: 75, Logic: 75, Persuasion: 75 },
            isLocal: true 
          });
        }
        console.warn('API Error, using local coach.');
      }
    }

    const fallback = localCoach(prompt);
    return res.json({ success: true, data: fallback.message, metrics: fallback.metrics, isLocal: true });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { chatWithAI };
