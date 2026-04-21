const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Flashcard } = require('../models/Flashcard');
const { Quiz } = require('../models/Quiz');
const { Lesson } = require('../models/Lesson');
const Progress = require('../models/Progress');
const mongoose = require('mongoose');

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// ── Helper: Call Gemini and get JSON back ─────────────────────────────────────
async function callGeminiJSON(prompt) {
  if (!genAI) throw new Error('No Gemini API key');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Gemini Timeout')), 15000)
  );
  const result = await Promise.race([model.generateContent(prompt), timeoutPromise]);
  let text = result.response.text().trim();
  // Strip markdown code fences if present
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(text);
}

// ── Seed or Fetch Flashcards ──────────────────────────────────────────────────
const getFlashcards = async (req, res) => {
  try {
    const language = req.query.lang || 'Spanish';

    // Always try to clear stale placeholder data and regenerate if AI is available
    let cards = await Flashcard.find({ language });

    // If no cards, or only placeholder data, generate via Gemini
    if (cards.length === 0) {
      let newCards = [];

      try {
        const prompt = `You are a language learning AI.
Generate exactly 8 beginner-level flashcards for the language: "${language}".
Focus on common everyday words (greetings, numbers, colors, food, etc.).
Respond ONLY with a valid JSON array — no markdown, no explanation.
Format:
[
  {
    "word": "the word in ${language}",
    "translation": "English meaning",
    "pronunciation": "phonetic pronunciation guide in English letters",
    "category": "category name"
  }
]`;
        const data = await callGeminiJSON(prompt);
        newCards = data.map(item => ({
          language,
          level: 'Beginner',
          word: item.word || `word`,
          translation: item.translation || 'translation',
          pronunciation: item.pronunciation || '',
          category: item.category || 'General'
        }));
        console.log(`✅ Generated ${newCards.length} AI flashcards for ${language}`);
      } catch (aiError) {
        console.warn('Gemini flashcard generation failed, using static fallback:', aiError.message);
        // Static fallback for common languages
        const staticData = {
          Spanish: [
            { word: 'Hola', translation: 'Hello', pronunciation: 'oh-lah' },
            { word: 'Gracias', translation: 'Thank you', pronunciation: 'grah-see-as' },
            { word: 'Por favor', translation: 'Please', pronunciation: 'por fah-vor' },
            { word: 'Adiós', translation: 'Goodbye', pronunciation: 'ah-dyos' },
          ],
          French: [
            { word: 'Bonjour', translation: 'Hello', pronunciation: 'bohn-zhure' },
            { word: 'Merci', translation: 'Thank you', pronunciation: 'mair-see' },
            { word: 'S\'il vous plaît', translation: 'Please', pronunciation: 'seel voo play' },
            { word: 'Au revoir', translation: 'Goodbye', pronunciation: 'oh ruh-vwar' },
          ],
          Hindi: [
            { word: 'Namaste', translation: 'Hello', pronunciation: 'na-mas-tay' },
            { word: 'Dhanyavad', translation: 'Thank you', pronunciation: 'dhan-ya-vaad' },
            { word: 'Kripya', translation: 'Please', pronunciation: 'krip-yaa' },
            { word: 'Alvida', translation: 'Goodbye', pronunciation: 'al-vi-daa' },
          ],
        };
        const set = staticData[language] || [
          { word: `Hello`, translation: 'Hello', pronunciation: '(no pronunciation)' },
          { word: `Thank you`, translation: 'Thank you', pronunciation: '(no pronunciation)' },
        ];
        newCards = set.map(item => ({ language, level: 'Beginner', ...item }));
      }

      await Flashcard.insertMany(newCards);
      cards = await Flashcard.find({ language });
    }

    res.json({ success: true, data: cards });
  } catch (error) {
    console.error('getFlashcards error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Seed or Fetch Quiz ────────────────────────────────────────────────────────
const getQuiz = async (req, res) => {
  try {
    const language = req.query.lang || 'Spanish';
    let quiz = await Quiz.findOne({ language });

    if (!quiz) {
      let questions = [];

      try {
        const prompt = `You are a language learning AI.
Create exactly 5 beginner multiple-choice quiz questions for the language: "${language}".
Questions should test basic vocabulary (greetings, numbers, colors, body parts, common objects).
Each question must have exactly 4 options and one correct answer.
Respond ONLY with a valid JSON array — no markdown, no explanation.
Format:
[
  {
    "questionText": "What does '...' mean in English?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A"
  }
]`;
        questions = await callGeminiJSON(prompt);
        console.log(`✅ Generated ${questions.length} AI quiz questions for ${language}`);
      } catch (aiError) {
        console.warn('Gemini quiz generation failed, using generic fallback:', aiError.message);
        questions = [
          {
            questionText: `Which of these is a common greeting in ${language}?`,
            options: ['Hello', 'Apple', 'Running', 'Beautiful'],
            correctAnswer: 'Hello'
          },
          {
            questionText: `How do you say "Thank you" in ${language}?`,
            options: ['Goodbye', 'Please', 'Thank you', 'Yes'],
            correctAnswer: 'Thank you'
          }
        ];
      }

      quiz = new Quiz({
        title: `${language} Beginner Assessment`,
        language,
        level: 'Beginner',
        category: 'Vocabulary',
        questions,
        totalPoints: questions.length * 2
      });
      await quiz.save();
    }

    res.json({ success: true, data: quiz });
  } catch (error) {
    console.error('getQuiz error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Seed or Fetch Lesson ──────────────────────────────────────────────────────
const getLesson = async (req, res) => {
  try {
    const language = req.query.lang || 'Spanish';
    let lesson = await Lesson.findOne({ language });

    // Delete stale/invalid lesson (e.g. old docs that had no vocabulary field)
    if (lesson && lesson.content && lesson.content.includes('absolute basics') && (!lesson.vocabulary || lesson.vocabulary.length === 0)) {
      console.log(`🗑️ Deleting stale cached lesson for ${language}, will regenerate...`);
      await Lesson.deleteOne({ _id: lesson._id });
      lesson = null;
    }

    if (!lesson) {
      let content = '';
      let vocabulary = [];

      try {
        const apiKey = process.env.GEMINI_API_KEY;
        const isValidKey = apiKey && apiKey.startsWith('AIza') && apiKey.length > 20;
        if (!isValidKey) throw new Error('Invalid Gemini API key');

        const prompt = `You are a language learning teacher.
Create a beginner lesson introduction for the language: "${language}".
The lesson should include:
1. A brief welcoming introduction (2-3 sentences)
2. Explanation of the writing system or key differences from English (1-2 sentences)
3. 3 essential phrases a beginner should know, each with translation

Also provide a vocabulary list of 6 basic everyday words.

Respond ONLY with a valid JSON object — no markdown, no explanation.
Format:
{
  "content": "Full lesson text as a multiline string",
  "vocabulary": [
    { "word": "word in ${language}", "translation": "English meaning", "category": "category" }
  ]
}`;
        const data = await callGeminiJSON(prompt);
        content = data.content || '';
        vocabulary = Array.isArray(data.vocabulary) ? data.vocabulary : [];
        console.log(`✅ Generated AI lesson for ${language} with ${vocabulary.length} vocab items`);
      } catch (aiError) {
        console.warn('Gemini lesson generation failed, using rich fallback:', aiError.message);
        // Rich static fallback for common languages
        const staticLessons = {
          Spanish: {
            content: `¡Bienvenidos! Welcome to Spanish!\n\nSpanish is spoken by over 550 million people worldwide, making it one of the most widely spoken languages.\n\nHere are 3 essential phrases to get you started:\n➤ Hola — Hello\n➤ ¿Cómo estás? — How are you?\n➤ Muchas gracias — Thank you very much`,
            vocabulary: [
              { word: 'Hola', translation: 'Hello', category: 'Greetings' },
              { word: 'Gracias', translation: 'Thank you', category: 'Greetings' },
              { word: 'Por favor', translation: 'Please', category: 'Polite phrases' },
              { word: 'Sí', translation: 'Yes', category: 'Basics' },
              { word: 'No', translation: 'No', category: 'Basics' },
              { word: 'Adiós', translation: 'Goodbye', category: 'Greetings' },
            ]
          },
          French: {
            content: `Bienvenue! Welcome to French!\n\nFrench is spoken by 300 million people and is known as the language of love and art.\n\nHere are 3 essential phrases:\n➤ Bonjour — Hello / Good morning\n➤ Comment allez-vous? — How are you?\n➤ Merci beaucoup — Thank you very much`,
            vocabulary: [
              { word: 'Bonjour', translation: 'Hello', category: 'Greetings' },
              { word: 'Merci', translation: 'Thank you', category: 'Greetings' },
              { word: 'S\'il vous plaît', translation: 'Please', category: 'Polite phrases' },
              { word: 'Oui', translation: 'Yes', category: 'Basics' },
              { word: 'Non', translation: 'No', category: 'Basics' },
              { word: 'Au revoir', translation: 'Goodbye', category: 'Greetings' },
            ]
          },
          Hindi: {
            content: `नमस्ते! Welcome to Hindi!\n\nHindi is spoken by over 600 million people, primarily in India. It uses the Devanagari script which reads left to right.\n\nHere are 3 essential phrases:\n➤ Namaste — Hello / Goodbye (formal)\n➤ Aap kaise hain? — How are you?\n➤ Bahut shukriya — Thank you very much`,
            vocabulary: [
              { word: 'Namaste', translation: 'Hello', category: 'Greetings' },
              { word: 'Dhanyavaad', translation: 'Thank you', category: 'Greetings' },
              { word: 'Kripaya', translation: 'Please', category: 'Polite phrases' },
              { word: 'Haan', translation: 'Yes', category: 'Basics' },
              { word: 'Nahi', translation: 'No', category: 'Basics' },
              { word: 'Alvida', translation: 'Goodbye', category: 'Greetings' },
            ]
          },
        };
        const fallback = staticLessons[language] || {
          content: `Welcome to ${language}!\n\nGet ready to start your ${language} learning journey. Every expert was once a beginner!\n\nHere are some tips:\n➤ Practice daily, even for 5 minutes\n➤ Listen to ${language} music or shows\n➤ Don't be afraid to make mistakes!`,
          vocabulary: [
            { word: 'Hello', translation: 'Greeting word', category: 'Basics' },
            { word: 'Thank you', translation: 'Gratitude', category: 'Basics' },
            { word: 'Please', translation: 'Polite request', category: 'Basics' },
            { word: 'Yes', translation: 'Affirmation', category: 'Basics' },
            { word: 'No', translation: 'Negation', category: 'Basics' },
            { word: 'Goodbye', translation: 'Farewell', category: 'Basics' },
          ]
        };
        content = fallback.content;
        vocabulary = fallback.vocabulary;
      }

      lesson = new Lesson({
        title: `Introduction to ${language}`,
        language,
        level: 'Beginner',
        category: 'Grammar',
        content,
        vocabulary
      });
      await lesson.save();
    }

    res.json({ success: true, data: lesson });
  } catch (error) {
    console.error('getLesson error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Seed or Fetch Progress ────────────────────────────────────────────────────
const getProgress = async (req, res) => {
  try {
    const language = req.query.lang || 'Spanish';
    let userId = req.user?.id || new mongoose.Types.ObjectId();

    let progress = await Progress.findOne({ targetLanguage: language });
    if (!progress) {
      progress = new Progress({
        user: userId,
        targetLanguage: language,
        totalXP: Math.floor(Math.random() * 500) + 100,
        level: 2,
        currentStreak: 3,
        longestStreak: 5,
        stats: {
          lessonsCompleted: 2,
          flashcardsReviewed: 15,
          quizzesAttempted: 2,
          quizzesPassed: 1
        },
        skills: {
          grammar: 30,
          vocabulary: 50,
          speaking: 10,
          listening: 25,
          reading: 40
        }
      });
      await progress.save();
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    console.error('getProgress error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Force Refresh: Clear cached data for a language so AI regenerates it ──────
const refreshContent = async (req, res) => {
  try {
    const language = req.query.lang || 'Spanish';
    await Flashcard.deleteMany({ language });
    await Quiz.deleteMany({ language });
    await Lesson.deleteMany({ language });
    console.log(`🔄 Cleared cached content for language: ${language}`);
    res.json({ success: true, message: `Content for ${language} cleared. Fetch again to regenerate.` });
  } catch (error) {
    console.error('refreshContent error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFlashcards, getQuiz, getLesson, getProgress, refreshContent };

