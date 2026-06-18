const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, nativeLanguage, targetLanguage } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // The password will be hashed by the User model's pre-save hook
    const user = await User.create({ 
      name, 
      email, 
      password,
      nativeLanguage: nativeLanguage || 'English',
      targetLanguage: targetLanguage || 'Spanish'
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          nativeLanguage: user.nativeLanguage,
          targetLanguage: user.targetLanguage,
          proficiencyLevel: user.proficiencyLevel,
          totalXP: user.totalXP,
          streak: user.streak,
          token: generateToken(user._id),
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          nativeLanguage: user.nativeLanguage,
          targetLanguage: user.targetLanguage,
          proficiencyLevel: user.proficiencyLevel,
          totalXP: user.totalXP,
          streak: user.streak,
          token: generateToken(user._id),
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.nativeLanguage = req.body.nativeLanguage || user.nativeLanguage;
      user.targetLanguage = req.body.targetLanguage || user.targetLanguage;
      user.proficiencyLevel = req.body.proficiencyLevel || user.proficiencyLevel;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          nativeLanguage: updatedUser.nativeLanguage,
          targetLanguage: updatedUser.targetLanguage,
          proficiencyLevel: updatedUser.proficiencyLevel,
          totalXP: updatedUser.totalXP,
          streak: updatedUser.streak,
          token: generateToken(updatedUser._id),
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };