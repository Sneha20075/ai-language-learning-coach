const { GoogleGenerativeAI } = require('@google/generative-ai');
const ObjectDetectionSession = require('../models/ObjectDetection');

// ── Helper: Call Gemini Vision ────────────────────────────────────────────────
async function callGeminiVision(apiKey, prompt, imageBase64, imageMimeType) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const contentParts = [
    { text: prompt },
    {
      inlineData: {
        data: imageBase64,
        mimeType: imageMimeType || 'image/jpeg'
      }
    }
  ];

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('AI Request Timeout after 20s')), 20000)
  );

  const result = await Promise.race([model.generateContent(contentParts), timeoutPromise]);
  let text = result.response.text().trim();
  // Strip markdown code fences
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(text);
}

// ── Fallback: Smart mock objects when AI unavailable ──────────────────────────
function getMockObjects(targetLanguage) {
  const translations = {
    Spanish:  [
      { objectName: 'Person', translation: 'Persona', confidence: 0.92 },
      { objectName: 'Hand',   translation: 'Mano',    confidence: 0.88 },
      { objectName: 'Phone',  translation: 'Teléfono',confidence: 0.85 },
      { objectName: 'Table',  translation: 'Mesa',    confidence: 0.80 },
    ],
    French: [
      { objectName: 'Person', translation: 'Personne',confidence: 0.92 },
      { objectName: 'Hand',   translation: 'Main',    confidence: 0.88 },
      { objectName: 'Phone',  translation: 'Téléphone',confidence: 0.85 },
      { objectName: 'Table',  translation: 'Table',   confidence: 0.80 },
    ],
    Hindi: [
      { objectName: 'Person', translation: 'व्यक्ति (Vyakti)',  confidence: 0.92 },
      { objectName: 'Hand',   translation: 'हाथ (Haath)',       confidence: 0.88 },
      { objectName: 'Phone',  translation: 'फ़ोन (Phone)',      confidence: 0.85 },
      { objectName: 'Table',  translation: 'मेज़ (Mez)',        confidence: 0.80 },
    ],
    German: [
      { objectName: 'Person', translation: 'Person',  confidence: 0.92 },
      { objectName: 'Hand',   translation: 'Hand',    confidence: 0.88 },
      { objectName: 'Phone',  translation: 'Telefon', confidence: 0.85 },
      { objectName: 'Table',  translation: 'Tisch',   confidence: 0.80 },
    ],
    Japanese: [
      { objectName: 'Person', translation: '人 (Hito)',           confidence: 0.92 },
      { objectName: 'Hand',   translation: '手 (Te)',             confidence: 0.88 },
      { objectName: 'Phone',  translation: '電話 (Denwa)',        confidence: 0.85 },
      { objectName: 'Table',  translation: 'テーブル (Tēburu)',   confidence: 0.80 },
    ],
  };
  return translations[targetLanguage] || [
    { objectName: 'Object 1', translation: `[${targetLanguage} translation — add Gemini API key]`, confidence: 0.90 },
    { objectName: 'Object 2', translation: `[${targetLanguage} translation — add Gemini API key]`, confidence: 0.85 },
  ];
}

// ── POST /api/object-detection/detect ────────────────────────────────────────
const detectObjects = async (req, res) => {
  try {
    const { imageBase64, imageMimeType, targetLanguage } = req.body;

    if (!imageBase64 || !targetLanguage) {
      return res.status(400).json({ success: false, message: 'Image and target language are required.' });
    }

    let detectedObjects = [];
    let usedFallback = false;

    const apiKey = process.env.GEMINI_API_KEY;
    const isValidKey = apiKey && apiKey.startsWith('AIza') && apiKey.length > 20;

    if (isValidKey) {
      try {
        const prompt = `You are a visual translator for a language learning app.
Examine the image carefully and identify the 4 to 7 most prominent, visible objects or items.
Provide the English name and the translation in ${targetLanguage}.
Also include a short pronunciation guide in English letters for the ${targetLanguage} word.
Respond ONLY with a valid JSON array — no markdown, no explanation.
Format:
[
  {
    "objectName": "English name of the object",
    "translation": "Translation in ${targetLanguage}",
    "pronunciation": "how to pronounce the ${targetLanguage} word",
    "confidence": 0.95
  }
]`;
        detectedObjects = await callGeminiVision(apiKey, prompt, imageBase64, imageMimeType);
        console.log(`✅ Gemini detected ${detectedObjects.length} objects in ${targetLanguage}`);
      } catch (aiError) {
        console.warn('Gemini Vision failed, using fallback:', aiError.message);
        detectedObjects = getMockObjects(targetLanguage);
        usedFallback = true;
      }
    } else {
      console.warn('Invalid or missing Gemini API key — using mock objects');
      detectedObjects = getMockObjects(targetLanguage);
      usedFallback = true;
    }

    // Validate structure
    if (!Array.isArray(detectedObjects) || detectedObjects.length === 0) {
      detectedObjects = getMockObjects(targetLanguage);
      usedFallback = true;
    }

    // Save to database
    const session = new ObjectDetectionSession({
      user: req.user.id,
      targetLanguage,
      detectedObjects
    });
    await session.save();

    return res.status(200).json({
      success: true,
      data: session,
      usedFallback,
      message: usedFallback
        ? 'Showing sample results. Add a valid Gemini API key for real AI detection.'
        : 'Objects detected successfully!'
    });

  } catch (error) {
    console.error('Object Detection Fatal Error:', error);
    res.status(500).json({ success: false, message: 'Detection failed: ' + error.message });
  }
};

// ── POST /api/object-detection/analyze-drawing ───────────────────────────────
// Kids draw something → AI guesses what it is → teaches the word
const analyzeDrawing = async (req, res) => {
  try {
    const { imageBase64, imageMimeType, targetLanguage } = req.body;

    if (!imageBase64 || !targetLanguage) {
      return res.status(400).json({ success: false, message: 'Drawing and target language are required.' });
    }

    let result = null;
    const apiKey = process.env.GEMINI_API_KEY;
    const isValidKey = apiKey && apiKey.startsWith('AIza') && apiKey.length > 20;

    if (isValidKey) {
      try {
        const prompt = `You are a friendly AI teacher helping young children learn languages through drawing.
A child has drawn something. Look at the drawing carefully and figure out what it is.
Even if the drawing is simple or rough, make your best guess.
Be very encouraging and positive!

Respond ONLY with a valid JSON object — no markdown, no explanation.
Format:
{
  "guessedObject": "what you think the child drew (in English)",
  "confidence": 0.85,
  "encouragement": "A fun, short encouraging message for the child (e.g. 'Wow, great dog!')",
  "targetWord": "the word for this object in ${targetLanguage}",
  "pronunciation": "how to pronounce it phonetically",
  "exampleSentence": "A very simple example sentence using this word in ${targetLanguage}",
  "funFact": "A short fun fact about this object suitable for children"
}`;
        result = await callGeminiVision(apiKey, prompt, imageBase64, imageMimeType);
        console.log(`✅ Drawing analyzed: guessed "${result.guessedObject}" in ${targetLanguage}`);
      } catch (aiError) {
        console.warn('Drawing analysis failed:', aiError.message);
      }
    }

    // Fallback if AI unavailable
    if (!result) {
      result = {
        guessedObject: 'Something wonderful',
        confidence: 0.7,
        encouragement: "What a creative drawing! 🎨 You're amazing!",
        targetWord: '[Add Gemini API key for real translation]',
        pronunciation: '',
        exampleSentence: '',
        funFact: 'Keep drawing — every great artist started just like you!'
      };
    }

    return res.status(200).json({ success: true, data: result });

  } catch (error) {
    console.error('Drawing Analysis Error:', error);
    res.status(500).json({ success: false, message: 'Analysis failed: ' + error.message });
  }
};

module.exports = { detectObjects, analyzeDrawing };
