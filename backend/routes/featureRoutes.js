const express = require('express');
const router = express.Router();
const { getFlashcards, getQuiz, getLesson, getProgress, refreshContent, getLeaderboard, reviewFlashcard, completeLesson } = require('../controllers/featureController');
const { verifyToken } = require('./verifyToken');

router.get('/flashcards', verifyToken, getFlashcards);
router.post('/flashcards/review', verifyToken, reviewFlashcard);
router.get('/quiz', getQuiz);
router.get('/lesson', getLesson);
router.get('/progress', verifyToken, getProgress);
router.post('/lessons/complete', verifyToken, completeLesson);
router.get('/leaderboard', getLeaderboard);
router.delete('/refresh', refreshContent); // Clears cached AI content for a language

module.exports = router;
