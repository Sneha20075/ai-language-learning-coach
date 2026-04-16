const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { verifyToken } = require('./verifyToken');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Example of how to use verifyToken for a protected route:
// router.get('/profile', verifyToken, (req, res) => {
//   res.json({ message: "This is protected data", user: req.user });
// });

module.exports = router;
