const mongoose = require('mongoose');

// Schema for the "Learn" section
const lessonSchema = new mongoose.Schema(
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
      enum: ['Grammar', 'Vocabulary', 'Pronunciation', 'Culture', 'Phrases'],
      default: 'Grammar',
    },
    vocabulary: [
      {
        word: { type: String },
        translation: { type: String },
        category: { type: String, default: 'General' },
      }
    ],
    content: {
      type: String,
      required: true,
    },
    xpReward: {
      type: Number,
      default: 10,
    },
    order: {
      type: Number,
      default: 0,
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

// Track which lessons a user has completed
const userLessonProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model('Lesson', lessonSchema);
const UserLessonProgress = mongoose.model('UserLessonProgress', userLessonProgressSchema);

module.exports = { Lesson, UserLessonProgress };
