const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiController');
const { verifyToken } = require('./verifyToken');

router.post('/chat', verifyToken, chatWithAI);

module.exports = router;
