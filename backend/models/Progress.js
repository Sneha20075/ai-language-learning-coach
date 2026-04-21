const mongoose = require('mongoose');

// Schema for overall "Progress / Profile" section
// Tracks all user activity and learning progress
const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    targetLanguage: {
      type: String,
      required: true,
    },
    // XP & Level
    totalXP: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    // Daily streak tracking
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastStudyDate: {
      type: Date,
    },
    // Activity counts per module
    stats: {
      lessonsCompleted: { type: Number, default: 0 },
      flashcardsReviewed: { type: Number, default: 0 },
      quizzesAttempted: { type: Number, default: 0 },
      quizzesPassed: { type: Number, default: 0 },
      roleplaySessions: { type: Number, default: 0 },
      objectsDetected: { type: Number, default: 0 },
      totalStudyTimeMinutes: { type: Number, default: 0 },
    },
    // Average scores
    averageScores: {
      quiz: { type: Number, default: 0 },
      roleplay: { type: Number, default: 0 },
    },
    // Skill breakdown (0-100)
    skills: {
      grammar: { type: Number, default: 0 },
      vocabulary: { type: Number, default: 0 },
      listening: { type: Number, default: 0 },
      speaking: { type: Number, default: 0 },
      reading: { type: Number, default: 0 },
    },
    // Badges/Achievements earned
    badges: [
      {
        name: { type: String },
        description: { type: String },
        earnedAt: { type: Date, default: Date.now },
        iconUrl: { type: String },
      },
    ],
    // Daily activity log for heatmap
    activityLog: [
      {
        date: { type: Date, required: true },
        xpEarned: { type: Number, default: 0 },
        minutesStudied: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Progress', progressSchema);
