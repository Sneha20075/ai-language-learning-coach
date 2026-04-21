const mongoose = require('mongoose');

// Individual question schema
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'fill-in-blank', 'true-false'],
    default: 'multiple-choice',
  },
  options: [
    {
      type: String,
    },
  ],
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
  },
  points: {
    type: Number,
    default: 1,
  },
});

// Quiz schema for the "Quiz" section
const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    category: {
      type: String,
      enum: ['Grammar', 'Vocabulary', 'Listening', 'Reading', 'Mixed'],
      default: 'Mixed',
    },
    questions: [questionSchema],
    totalPoints: {
      type: Number,
      default: 0,
    },
    timeLimit: {
      type: Number, // in minutes
      default: 10,
    },
    xpReward: {
      type: Number,
      default: 20,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Track user quiz attempts
const userQuizResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedAnswer: String,
        isCorrect: Boolean,
      },
    ],
    timeTaken: {
      type: Number, // in seconds
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model('Quiz', quizSchema);
const UserQuizResult = mongoose.model('UserQuizResult', userQuizResultSchema);

module.exports = { Quiz, UserQuizResult };
