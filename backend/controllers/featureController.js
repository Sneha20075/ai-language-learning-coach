const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Flashcard, UserFlashcardProgress } = require('../models/Flashcard');
const { Quiz } = require('../models/Quiz');
const { Lesson, UserLessonProgress } = require('../models/Lesson');
const Progress = require('../models/Progress');
const mongoose = require('mongoose');

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// ── Helper: Call Gemini and get JSON back ─────────────────────────────────────
async function callGeminiJSON(prompt) {
  if (!genAI) throw new Error('No Gemini API key');
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
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
    const userId = req.user?.id;

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

    // Merge individual user progress if user is authenticated
    let cardsWithProgress = cards.map(c => c.toObject());
    if (userId) {
      const progressList = await UserFlashcardProgress.find({ user: userId });
      const progressMap = {};
      progressList.forEach(p => {
        progressMap[p.flashcard.toString()] = p;
      });
      cardsWithProgress = cards.map(c => {
        const prog = progressMap[c._id.toString()];
        return {
          ...c.toObject(),
          repetitions: prog ? prog.repetitions : 0,
          easeFactor: prog ? prog.easeFactor : 2.5,
          interval: prog ? prog.interval : 0,
          nextReviewDate: prog ? prog.nextReviewDate : null
        };
      });
    }

    res.json({ success: true, data: cardsWithProgress });
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
        const prompt = `You are a production-level AI Language Teacher.
Create a beginner quiz for "${language}".
The quiz should:
1. Include 5 multiple-choice questions.
2. Use a mix of English and ${language} (Hinglish style if applicable).
3. Test common vocabulary and phrases.

Respond ONLY with a valid JSON array.
Format:
[
  {
    "questionText": "Question text...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "The correct option"
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
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        const isValidKey = apiKey && apiKey.startsWith('AIza') && apiKey.length > 20;
        if (!isValidKey) throw new Error('Invalid Gemini API key');

        const prompt = `You are an elite language teacher for LinguaCoach AI.
Create a structured Daily Lesson for: "${language}".
Respond ONLY with a valid JSON object.
Format:
{
  "title": "Topic Name",
  "wordOfTheDay": { "word": "...", "translation": "...", "pronunciation": "..." },
  "grammarTip": { "title": "...", "explanation": "..." },
  "practiceDialogue": [
    { "speaker": "A", "text": "...", "translation": "..." },
    { "speaker": "B", "text": "...", "translation": "..." }
  ],
  "miniQuiz": [
    { "question": "...", "options": ["...", "...", "..."], "correctAnswer": "..." }
  ],
  "vocabulary": [
    { "word": "...", "translation": "...", "category": "..." }
  ],
  "content": "A welcoming intro string"
}`;
        const data = await callGeminiJSON(prompt);
        
        lesson = new Lesson({
          title: data.title || `Introduction to ${language}`,
          language,
          level: 'Beginner',
          category: 'Daily Lesson',
          wordOfTheDay: data.wordOfTheDay,
          grammarTip: data.grammarTip,
          practiceDialogue: data.practiceDialogue,
          miniQuiz: data.miniQuiz,
          vocabulary: data.vocabulary,
          content: data.content || `Welcome to your ${language} journey!`
        });
        await lesson.save();
        console.log(`✅ Generated Elite AI lesson for ${language}`);
      } catch (aiError) {
        console.warn('AI lesson generation failed, using fallback.');
        lesson = new Lesson({
          title: `Basics of ${language}`,
          language,
          level: 'Beginner',
          content: `Welcome to ${language}! Learn everyday phrases and master the basics.`,
          wordOfTheDay: { 
            word: language === 'Spanish' ? "Hola" : (language === 'French' ? "Bonjour" : "Namaste"), 
            translation: "Hello", 
            pronunciation: language === 'Spanish' ? "oh-lah" : (language === 'French' ? "bohn-zhure" : "na-mas-tay") 
          },
          grammarTip: { 
            title: "Common Greetings", 
            explanation: "It is important to greet people with appropriate respect in social interactions." 
          },
          practiceDialogue: [
            { 
              speaker: "A", 
              text: language === 'Spanish' ? "Hola, ¿cómo estás?" : (language === 'French' ? "Bonjour, comment ça va?" : "Namaste, aap kaise hain?"), 
              translation: "Hello, how are you?" 
            },
            { 
              speaker: "B", 
              text: language === 'Spanish' ? "Bien, gracias. ¿Y tú?" : (language === 'French' ? "Très bien, merci. Et toi?" : "Main theek hoon, dhanyavaad. Aur aap?"), 
              translation: "Fine, thank you. And you?" 
            }
          ],
          miniQuiz: [
            { 
              question: `Identify the translation of "Hello" in ${language}:`, 
              options: language === 'Spanish' ? ["Hola", "Adiós", "Gracias"] : (language === 'French' ? ["Bonjour", "Merci", "Au revoir"] : ["Namaste", "Dhanyavad", "Alvida"]), 
              correctAnswer: language === 'Spanish' ? "Hola" : (language === 'French' ? "Bonjour" : "Namaste") 
            }
          ],
          vocabulary: [
            { 
              word: language === 'Spanish' ? "Gracias" : (language === 'French' ? "Merci" : "Dhanyavad"), 
              translation: "Thank you", 
              category: "Basics" 
            }
          ]
        });
        await lesson.save();
      }
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
    let userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    let progress = await Progress.findOne({ user: userId });
    if (!progress) {
      progress = new Progress({
        user: userId,
        targetLanguage: language,
        totalXP: 100,
        level: 1,
        currentStreak: 1,
        longestStreak: 1,
        stats: {
          lessonsCompleted: 0,
          flashcardsReviewed: 0,
          quizzesAttempted: 0,
          quizzesPassed: 0,
          roleplaySessions: 0,
          objectsDetected: 0,
          totalStudyTimeMinutes: 0
        },
        skills: {
          grammar: 10,
          vocabulary: 10,
          speaking: 5,
          listening: 5,
          reading: 5
        }
      });
      await progress.save();
    } else if (req.query.lang && progress.targetLanguage !== language) {
      progress.targetLanguage = language;
      await progress.save();
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    console.error('getProgress error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Flashcard Review (SRS) Logic ───────────────────────────────────────────
const reviewFlashcard = async (req, res) => {
  try {
    const { cardId, repetitions, easeFactor, interval, nextReviewDate } = req.body;
    const userId = req.user?.id || req.body.userId; // Support both auth and manual

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // Update or Create Progress for this specific flashcard
    await UserFlashcardProgress.findOneAndUpdate(
      { user: userId, flashcard: cardId },
      { 
        repetitions, 
        easeFactor, 
        interval, 
        nextReviewDate,
        status: repetitions > 2 ? 'known' : 'learning',
        $inc: { reviewCount: 1 },
        lastReviewed: new Date()
      },
      { upsert: true, new: true }
    );

    // Update global progress stats
    const flashcard = await Flashcard.findById(cardId);
    const language = flashcard ? flashcard.language : 'Spanish';
    await Progress.findOneAndUpdate(
      { user: userId },
      { 
        $inc: { "stats.flashcardsReviewed": 1, totalXP: 5 },
        $setOnInsert: { targetLanguage: language }
      },
      { upsert: true }
    );

    // Sync with User model for leaderboard
    await User.findByIdAndUpdate(userId, { $inc: { totalXP: 5 } });

    res.json({ success: true, message: "SRS data synchronized." });
  } catch (error) {
    console.error('reviewFlashcard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

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

const User = require('../models/User');

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({}, 'name totalXP level avatar')
      .sort({ totalXP: -1 })
      .limit(10);
    
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('getLeaderboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const completeLesson = async (req, res) => {
  try {
    const { lessonId, score } = req.body;
    const userId = req.user.id;

    if (!lessonId) {
      return res.status(400).json({ success: false, message: "Lesson ID is required." });
    }

    // Save or update user lesson progress
    await UserLessonProgress.findOneAndUpdate(
      { user: userId, lesson: lessonId },
      { completed: true, completedAt: new Date(), score: score || 100 },
      { upsert: true, new: true }
    );

    // Update global progress stats
    const lesson = await Lesson.findById(lessonId);
    const language = lesson ? lesson.language : 'Spanish';
    const xpEarned = 20;
    await Progress.findOneAndUpdate(
      { user: userId },
      { 
        $inc: { "stats.lessonsCompleted": 1, totalXP: xpEarned },
        $set: { lastStudyDate: new Date() },
        $setOnInsert: { targetLanguage: language }
      },
      { upsert: true }
    );

    // Sync with User model for leaderboard
    await User.findByIdAndUpdate(userId, { $inc: { totalXP: xpEarned } });

    res.json({ success: true, message: "Lesson progress saved. XP awarded!", xpEarned });
  } catch (error) {
    console.error('completeLesson error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFlashcards, getQuiz, getLesson, getProgress, refreshContent, getLeaderboard, reviewFlashcard, completeLesson };

