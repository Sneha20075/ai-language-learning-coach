const mongoose = require('mongoose');

// Schema for the "Practice > Object Detection" section
// User scans/uploads an image and learns vocabulary for detected objects
const objectDetectionSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetLanguage: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String, // URL to the uploaded/captured image
    },
    // Objects detected in the image and their translations
    detectedObjects: [
      {
        objectName: {
          type: String, // English name of the detected object
          required: true,
        },
        translation: {
          type: String, // Translation in target language
          required: true,
        },
        confidence: {
          type: Number, // Detection confidence score (0-1)
          default: 0,
        },
        pronunciation: {
          type: String,
        },
        exampleSentence: {
          type: String,
        },
        userLearned: {
          type: Boolean,
          default: false,
        },
      },
    ],
    xpEarned: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
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

module.exports = mongoose.model('ObjectDetectionSession', objectDetectionSessionSchema);
