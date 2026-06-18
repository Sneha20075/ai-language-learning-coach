const mongoose = require('mongoose');

// Schema for the "Learn" section — Updated for Elite Daily Lessons
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
      default: 'Daily Lesson',
    },
    wordOfTheDay: {
      word: { type: String },
      translation: { type: String },
      pronunciation: { type: String }
    },
    grammarTip: {
      title: { type: String },
      explanation: { type: String }
    },
    practiceDialogue: [
      {
        speaker: { type: String },
        text: { type: String },
        translation: { type: String }
      }
    ],
    miniQuiz: [
      {
        question: { type: String },
        options: [{ type: String }],
        correctAnswer: { type: String }
      }
    ],
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
      default: 20,
    }
  },
  {
    timestamps: true,
  }
);

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
