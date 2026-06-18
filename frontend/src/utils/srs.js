/**
 * Spaced Repetition Algorithm (SM-2)
 * 
 * @param {number} quality - Response quality (0-5)
 * @param {number} repetitions - Number of consecutive correct responses
 * @param {number} easeFactor - Easiness factor (default 2.5)
 * @param {number} interval - Previous interval in days
 * @returns {object} { repetitions, easeFactor, interval, nextReviewDate }
 */
export const calculateNextReview = (quality, repetitions, easeFactor, interval) => {
  let nextRepetitions = repetitions;
  let nextEaseFactor = easeFactor;
  let nextInterval = interval;

  if (quality >= 3) {
    if (nextRepetitions === 0) {
      nextInterval = 1;
    } else if (nextRepetitions === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(interval * easeFactor);
    }
    nextRepetitions += 1;
  } else {
    nextRepetitions = 0;
    nextInterval = 1;
  }

  nextEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (nextEaseFactor < 1.3) nextEaseFactor = 1.3;

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

  return {
    repetitions: nextRepetitions,
    easeFactor: nextEaseFactor,
    interval: nextInterval,
    nextReviewDate
  };
};
