const mongoose = require('mongoose');

// Schema for the "Practice > Roleplay Conversation" section
const roleplaySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    scenario: {
      type: String,
      required: true,
      enum: [
        'ordering food',
        'introducing yourself',
        'asking for directions',
        'shopping',
        'hotel check-in',
        'classroom conversation',
        'job interview',
        'doctor visit',
        'airport conversation',
        'custom',
      ],
    },
    scenarioTitle: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    // Conversation history with AI
    messages: [
      {
        sender: {
          type: String,
          enum: ['user', 'ai'],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // AI feedback on the session
    feedback: {
      grammarScore: { type: Number, default: 0 },
      vocabularyScore: { type: Number, default: 0 },
      fluencyScore: { type: Number, default: 0 },
      overallScore: { type: Number, default: 0 },
      corrections: [{ type: String }],
      suggestions: [{ type: String }],
      summary: { type: String },
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    xpEarned: {
      type: Number,
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

module.exports = mongoose.model('RoleplaySession', roleplaySessionSchema);
