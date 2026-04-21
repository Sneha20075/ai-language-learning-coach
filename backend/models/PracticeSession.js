const mongoose = require('mongoose');

// Schema for "Practice > Listening" and "Practice > Speaking" sessions
const practiceSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['listening', 'speaking'],
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    // For listening practice
    audioUrl: {
      type: String,
    },
    transcript: {
      type: String,
    },
    // For speaking practice
    promptText: {
      type: String,
    },
    userAudioUrl: {
      type: String, // Recorded audio URL
    },
    userTranscript: {
      type: String, // Transcribed user speech
    },
    // AI feedback
    feedback: {
      pronunciationScore: { type: Number, default: 0 },
      fluencyScore: { type: Number, default: 0 },
      accuracyScore: { type: Number, default: 0 },
      overallScore: { type: Number, default: 0 },
      corrections: [{ type: String }],
      suggestions: [{ type: String }],
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PracticeSession', practiceSessionSchema);
