const { GoogleGenerativeAI } = require('@google/generative-ai');

// ─── Smart Local Coaching Engine ────────────────────────────────────────────
function localCoach(prompt) {
  const text = prompt.trim();
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const wordCount = words.length;

  // --- Grammar Analysis ---
  const grammarIssues = [];
  const grammarTips = [];

  // Check contractions / common mistakes
  if (/\bi\b(?!\s+(am|will|can|have|had|was|would|should|could|do|did))/.test(text))
    grammarIssues.push('Always capitalize "I" as a pronoun.');
  if (/\b(their|there|they're)\b/i.test(text) && wordCount < 10)
    grammarTips.push('Double-check usage of "their / there / they\'re".');
  if (/\b(your|you're)\b/i.test(text) && wordCount < 10)
    grammarTips.push('Verify "your" vs "you\'re" usage.');
  if (/\b(its|it's)\b/i.test(text))
    grammarTips.push('Confirm correct usage of "its" (possessive) vs "it\'s" (it is).');
  if (wordCount > 5 && sentences.length === 1 && !/[.!?]$/.test(text.trim()))
    grammarIssues.push('Your sentence appears to be missing end punctuation.');
  if (/  +/.test(text))
    grammarIssues.push('Remove extra spaces between words.');

  // Passive voice check
  const hasPassive = /\b(is|are|was|were|be|been|being)\s+\w+ed\b/i.test(text);
  if (hasPassive) grammarTips.push('Consider using active voice for more impact.');

  // Filler words
  const fillers = ['basically', 'literally', 'actually', 'very', 'really', 'just', 'stuff', 'things'];
  const foundFillers = fillers.filter(f => new RegExp(`\\b${f}\\b`, 'i').test(text));
  if (foundFillers.length > 0)
    grammarTips.push(`Minimize filler/vague words like: "${foundFillers.join('", "')}".`);

  // Sentence variety
  const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : wordCount;
  if (sentences.length > 2 && avgWordsPerSentence > 30)
    grammarTips.push('Your sentences are long. Try breaking them into shorter, punchy statements.');
  if (sentences.length > 2 && avgWordsPerSentence < 5)
    grammarTips.push('Your sentences are very short. Add more detail to strengthen your argument.');

  // --- Logic Analysis ---
  const logicTips = [];
  const hasConnectives = /\b(because|therefore|however|although|since|thus|consequently|furthermore|moreover|in addition|on the other hand|for example|for instance|in contrast|as a result)\b/i.test(text);
  const hasClaim = /\b(should|must|need|believe|think|argue|claim|suggest|propose|prove|show)\b/i.test(text);
  const hasEvidence = /\b(study|research|data|percent|statistics|example|case|fact|evidence|shows|proves|found)\b/i.test(text);
  const hasCounterpoint = /\b(however|although|despite|nevertheless|on the other hand|some may argue|critics)\b/i.test(text);

  if (!hasConnectives) logicTips.push('Use connectives (because, therefore, however) to link your ideas.');
  if (!hasClaim) logicTips.push('State your position clearly — what do you believe or argue?');
  if (!hasEvidence) logicTips.push('Support your argument with examples, data, or evidence.');
  if (!hasCounterpoint && wordCount > 20) logicTips.push('Acknowledge the opposing view to strengthen your argument.');

  // --- Persuasion Analysis ---
  const persuasionTips = [];
  const hasEmotional = /\b(imagine|consider|think about|feel|urgent|critical|important|essential|vital|powerful|transform|impact|change)\b/i.test(text);
  const hasCallToAction = /\b(should|must|let us|we need|take action|join|support|help|start|stop|begin)\b/i.test(text);
  const hasRhetorical = /\?/.test(text);

  if (!hasEmotional) persuasionTips.push('Add emotional language to connect with your audience.');
  if (!hasCallToAction) persuasionTips.push('Include a call-to-action — tell your audience what to do.');
  if (!hasRhetorical) persuasionTips.push('Try a rhetorical question to engage your reader.');

  // --- Compute Scores ---
  let grammarScore = 85;
  grammarScore -= grammarIssues.length * 8;
  grammarScore -= grammarTips.length * 4;
  grammarScore = Math.max(45, Math.min(98, grammarScore + Math.floor(Math.random() * 6)));

  let logicScore = 50;
  if (hasClaim) logicScore += 15;
  if (hasEvidence) logicScore += 15;
  if (hasConnectives) logicScore += 10;
  if (hasCounterpoint) logicScore += 10;
  logicScore = Math.max(40, Math.min(98, logicScore + Math.floor(Math.random() * 6)));

  let persuasionScore = 45;
  if (hasEmotional) persuasionScore += 20;
  if (hasCallToAction) persuasionScore += 20;
  if (hasRhetorical) persuasionScore += 15;
  persuasionScore = Math.max(40, Math.min(98, persuasionScore + Math.floor(Math.random() * 6)));

  // --- Build Response ---
  const overallLevel = (grammarScore + logicScore + persuasionScore) / 3;
  const overallTag = overallLevel >= 80 ? '🔥 Strong' : overallLevel >= 65 ? '✅ Good' : '📈 Developing';

  let response = `### Coach's Feedback — ${overallTag}\n\n`;
  response += `**Your input** (${wordCount} words, ${sentences.length} sentence${sentences.length !== 1 ? 's' : ''}):\n> *"${text.length > 120 ? text.substring(0, 120) + '…' : text}"*\n\n`;

  // Grammar section
  response += `---\n\n#### 📝 Grammar & Style\n`;
  if (grammarIssues.length === 0 && grammarTips.length === 0) {
    response += `✅ Your grammar looks solid! No major issues detected.\n\n`;
  } else {
    if (grammarIssues.length > 0) {
      response += `**Issues to fix:**\n${grammarIssues.map(i => `- ⚠️ ${i}`).join('\n')}\n\n`;
    }
    if (grammarTips.length > 0) {
      response += `**Style tips:**\n${grammarTips.map(t => `- 💡 ${t}`).join('\n')}\n\n`;
    }
  }

  // Logic section
  response += `---\n\n#### 🧠 Logic & Structure\n`;
  if (logicTips.length === 0) {
    response += `✅ Your argument is well-structured with clear claims and supporting evidence.\n\n`;
  } else {
    response += `${logicTips.map(t => `- 💡 ${t}`).join('\n')}\n\n`;
  }

  // Persuasion section
  response += `---\n\n#### 🎯 Persuasion & Impact\n`;
  if (persuasionTips.length === 0) {
    response += `✅ Excellent persuasive techniques! Your writing is compelling and engaging.\n\n`;
  } else {
    response += `${persuasionTips.map(t => `- 💡 ${t}`).join('\n')}\n\n`;
  }

  // Closing tip
  const closingTips = [
    '**Pro tip:** Read your text aloud — you\'ll spot awkward phrasing instantly.',
    '**Pro tip:** The best arguments have a clear claim, evidence, and a memorable closing.',
    '**Pro tip:** Vary your sentence length. Short. Then longer and more detailed. It creates rhythm.',
    '**Pro tip:** Cut your word count by 20% — it almost always makes writing stronger.',
    '**Pro tip:** Start with your strongest point, not your weakest.',
  ];
  response += `---\n\n*${closingTips[Math.floor(Math.random() * closingTips.length)]}*`;

  return {
    message: response,
    metrics: { Grammar: grammarScore, Logic: logicScore, Persuasion: persuasionScore }
  };
}

// ─── Main Controller ─────────────────────────────────────────────────────────
const chatWithAI = async (req, res) => {
  const { prompt, imageBase64, imageMimeType, mode, language } = req.body;
  const targetLang = language || 'English';
  
  console.log(`AI Chat [${mode || 'coach'}] [${targetLang}]:`, prompt?.substring(0, 50));
  
  try {

    if (!prompt && !imageBase64) {
      return res.status(400).json({ success: false, message: 'Message or image is required' });
    }

    // Try Gemini API first if key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.length > 10) {
      try {
        console.log('Attempting Gemini API call...');
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // System instruction to ensure structured output
        let systemInstruction = "";
        if (mode === 'roleplay') {
          systemInstruction = `You are a friendly native speaker of ${targetLang}. 
          Internalize a specific roleplay persona (like a waiter, a friend, or a neighbor).
          Engage in a natural conversation with the user in ${targetLang}.
          Keep your responses relatively short and conversational.
          
          FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
          ---RESPONSE---
          [Your conversational response in ${targetLang}]
          ---METRICS---
          Grammar: [number 0-100]
          Logic: [number 0-100]
          Persuasion: [number 0-100]`;
        } else {
          systemInstruction = `You are a professional AI Language Coach specializing in ${targetLang}. 
          Analyze the user's text for grammar, logic, and persuasion.
          Be encouraging but critical. 
          
          FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
          ---RESPONSE---
          [Your detailed coaching feedback in markdown]
          ---METRICS---
          Grammar: [number 0-100]
          Logic: [number 0-100]
          Persuasion: [number 0-100]`;
        }

        const fullPrompt = `${systemInstruction}\n\nUser Input: ${prompt}`;
        
        // Use gemini-1.5-flash as it's stable and fast
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const contentParts = [fullPrompt];
        
        if (imageBase64) {
          contentParts.push({
            inlineData: {
              data: imageBase64,
              mimeType: imageMimeType || 'image/jpeg'
            }
          });
        }
        
        // Add a safety timeout for the API call (15 seconds)
        const chatPromise = model.generateContent(contentParts);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Gemini API Timeout')), 12000)
        );

        const result = await Promise.race([chatPromise, timeoutPromise]);
        const fullText = result.response.text();

        if (fullText) {
          console.log('Gemini API raw response received.');
          
          // More robust parsing
          let message = "";
          let metrics = { Grammar: 75, Logic: 75, Persuasion: 75 };

          if (fullText.includes('---RESPONSE---')) {
            const parts = fullText.split(/---METRICS---/i);
            message = parts[0].replace(/---RESPONSE---/i, '').trim();
            
            if (parts[1]) {
              metrics.Grammar = parseInt(parts[1].match(/Grammar:\s*(\d+)/i)?.[1] || 75);
              metrics.Logic = parseInt(parts[1].match(/Logic:\s*(\d+)/i)?.[1] || 75);
              metrics.Persuasion = parseInt(parts[1].match(/Persuasion:\s*(\d+)/i)?.[1] || 75);
            }
          } else {
            // Fallback if delimiters missing
            message = fullText;
          }

          console.log('SUCCESS: Gemini API processed successfully.');
          return res.json({ success: true, data: message, metrics });
        }
      } catch (apiErr) {
        console.warn('Gemini API Error:', apiErr.message);
        console.log('Falling back to Local Coach Engine...');
      }
    } else {
      console.log('No valid GEMINI_API_KEY found. Using Local Coach Engine.');
    }

    // ── Local Coach Engine (always works, no API needed) ──
    const { message, metrics } = localCoach(prompt);
    console.log('Local Coach Engine response generated.');

    return res.json({ success: true, data: message, metrics, isLocal: true });

  } catch (error) {
    console.error('AI CHAT FATAL ERROR:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'AI Tool Error: ' + error.message });
    }
  }
};

module.exports = { chatWithAI };
