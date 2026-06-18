const { GoogleGenerativeAI } = require('@google/generative-ai');

const detectObject = async (req, res) => {
  const { imageBase64, imageMimeType, targetLanguage = 'English' } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ success: false, message: "Gemini API Key is missing in .env" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are the Visual Learning Lab of LinguaCoach AI. 
Analyze this image and identify the main object(s). 
Return the results in a structured format. For each object identified, follow this EXACT format:

📷 Object Detected: [Object Name]
🌐 Translations: EN -> [word] | HI -> [word] | ${targetLanguage.toUpperCase()} -> [word]
📝 Example: [A short, natural example sentence using the word in ${targetLanguage}]
❓ Quick Quiz: [Ask a simple question to test if the user understands the word]

Rules:
- Be encouraging and educational.
- If multiple objects are seen, repeat the block for each.
- Do not include any other text outside these blocks.
`;

    const contentParts = [
      { text: prompt },
      {
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType || "image/jpeg"
        }
      }
    ];

    const result = await model.generateContent(contentParts);
    const text = result.response.text();
    console.log("[OBJECT DETECTION] AI Response:", text);

    // More robust parsing
    const objects = text.split(/📷 Object Detected:/i).filter(Boolean);
    const formattedResults = objects.map(obj => {
      const lines = obj.split('\n').map(l => l.trim()).filter(Boolean);
      const objectName = lines[0] || "Unknown Object";
      const translations = lines.find(l => l.includes('🌐 Translations:'))?.split('🌐 Translations:')[1]?.trim() || "No translations available";
      const example = lines.find(l => l.includes('📝 Example:'))?.split('📝 Example:')[1]?.trim() || "No example provided";
      const quiz = lines.find(l => l.includes('❓ Quick Quiz:'))?.split('❓ Quick Quiz:')[1]?.trim() || "No quiz available";

      return {
        objectName,
        translations,
        example,
        quiz
      };
    });

    res.json({
      success: true,
      data: {
        detectedObjects: formattedResults,
        rawText: text
      }
    });

  } catch (error) {
    console.error("OBJECT DETECTION ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const analyzeDrawing = async (req, res) => {
    const { imageBase64, imageMimeType, targetLanguage = 'English' } = req.body;
  
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const prompt = `
  You are the "Sketch & Learn" coach for LinguaCoach AI. 
  Identify what the user has drawn in this sketch.
  
  Provide:
  1. An encouraging remark about the drawing.
  2. The name of the object in English and ${targetLanguage}.
  3. A short example sentence in ${targetLanguage}.
  4. A quick quiz question.
  
  Format:
  🎉 Encouragement: [Remark]
  🎨 Guessed Object: [Name]
  🌐 Target Word: [Word in ${targetLanguage}]
  📝 Example: [Sentence]
  ❓ Quiz: [Question]
  `;
  
      const contentParts = [
        { text: prompt },
        {
          inlineData: {
            data: imageBase64,
            mimeType: imageMimeType || "image/png"
          }
        }
      ];
  
      const result = await model.generateContent(contentParts);
      const text = result.response.text();
      console.log("[DRAWING ANALYSIS] AI Response:", text);
  
      // Parse Drawing Result with more flexible regex
      const encouragement = text.match(/🎉 Encouragement:\s*(.*)/i)?.[1]?.trim() || "Great effort!";
      const guessedObject = text.match(/🎨 Guessed Object:\s*(.*)/i)?.[1]?.trim() || "Unknown";
      const targetWord    = text.match(/🌐 Target Word:\s*(.*)/i)?.[1]?.trim() || "Unknown";
      const exampleSentence = text.match(/📝 Example:\s*(.*)/i)?.[1]?.trim() || "No example available.";
      const quiz          = text.match(/❓ Quiz:\s*(.*)/i)?.[1]?.trim() || "No quiz available.";
  
      res.json({
        success: true,
        data: {
          detectedObjects: [
            {
              objectName: guessedObject,
              translations: `${targetWord} (Guessed: ${guessedObject})`,
              example: exampleSentence,
              quiz: quiz
            }
          ],
          encouragement
        }
      });
  
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

module.exports = { detectObjects: detectObject, analyzeDrawing };
