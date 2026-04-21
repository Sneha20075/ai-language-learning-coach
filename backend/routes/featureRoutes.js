const express = require('express');
const router = express.Router();
const { getFlashcards, getQuiz, getLesson, getProgress, refreshContent } = require('../controllers/featureController');

router.get('/flashcards', getFlashcards);
router.get('/quiz', getQuiz);
router.get('/lesson', getLesson);
router.get('/progress', getProgress);
router.delete('/refresh', refreshContent); // Clears cached AI content for a language

module.exports = router;
