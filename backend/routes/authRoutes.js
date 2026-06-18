const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { verifyToken } = require('./verifyToken');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);

module.exports = router;
