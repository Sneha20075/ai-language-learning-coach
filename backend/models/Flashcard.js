const mongoose = require('mongoose');

// Schema for the "Practice > Flashcards" section
const flashcardSchema = new mongoose.Schema(
  {
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
      default: 'General',
    },
    word: {
      type: String,
      required: true,
      trim: true,
    },
    translation: {
      type: String,
      required: true,
      trim: true,
    },
    exampleSentence: {
      type: String,
    },
    pronunciation: {
      type: String,
    },
    imageUrl: {
      type: String,
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

// Track user's flashcard practice
const userFlashcardProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    flashcard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flashcard',
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'learning', 'known'],
      default: 'new',
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    lastReviewed: {
      type: Date,
    },
    nextReviewDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Flashcard = mongoose.model('Flashcard', flashcardSchema);
const UserFlashcardProgress = mongoose.model('UserFlashcardProgress', userFlashcardProgressSchema);

module.exports = { Flashcard, UserFlashcardProgress };
