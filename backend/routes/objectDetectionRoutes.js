const express = require('express');
const router = express.Router();
const { detectObjects, analyzeDrawing } = require('../controllers/objectDetectionController');
const { verifyToken } = require('./verifyToken');

router.post('/detect', verifyToken, detectObjects);
router.post('/analyze-drawing', verifyToken, analyzeDrawing);

module.exports = router;
