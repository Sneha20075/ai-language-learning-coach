const { GoogleGenAI } = require('@google/genai');

const chatWithAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: "Server misconfiguration: GEMINI_API_KEY is not defined." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const defaultPrompt = `You are an expert AI Language and Debate Coach. 
    Evaluate the user's message and provide:
    1. A helpful, conversational response.
    2. Scores from 0-100 for: Grammar, Logic, and Persuasion.
    
    FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
    ---RESPONSE---
    [Your conversational response here]
    ---METRICS---
    Grammar: [score]
    Logic: [score]
    Persuasion: [score]

    User message: "${prompt}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: defaultPrompt,
    });

    const fullText = response.text;
    const responseMatch = fullText.match(/---RESPONSE---([\s\S]*?)---METRICS---/);
    const metricsMatch = fullText.match(/---METRICS---([\s\S]*)/);

    const message = responseMatch ? responseMatch[1].trim() : fullText;
    const metricsRaw = metricsMatch ? metricsMatch[1].trim() : "";
    
    const metrics = {
        Grammar: parseInt(metricsRaw.match(/Grammar:\s*(\d+)/)?.[1] || 0),
        Logic: parseInt(metricsRaw.match(/Logic:\s*(\d+)/)?.[1] || 0),
        Persuasion: parseInt(metricsRaw.match(/Persuasion:\s*(\d+)/)?.[1] || 0),
    };

    res.json({
      success: true,
      data: message,
      metrics: metrics
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ success: false, message: "An error occurred while communicating with the AI." });
  }
};

module.exports = { chatWithAI };
