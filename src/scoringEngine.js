import { TIMING_CONFIG, SCORING_CONFIG } from './gameConfig.js';

/**
 * Calculates score for a correct answer in Challenge Mode based on speed and streak.
 * 
 * Rules:
 * - Time <= fp: Earns 100% of max possible points (Base Points * Streak Multiplier).
 * - Time >= zp: Earns 0 points (Score remains unchanged).
 * - fp < Time < zp: Drops by percentage of remaining time, floored to nearest integer.
 * 
 * @param {string} topic - e.g. 'addition', 'subtraction', 'multiplication', 'division', 'bedmas'
 * @param {number} timeTakenSeconds - time taken in seconds
 * @param {number} currentStreak - current correct answer streak
 * @returns {object} { pointsEarned, percentageRemaining, timeTakenSeconds }
 */
export function calculateChallengeScore(topic, timeTakenSeconds, currentStreak = 0) {
  const topicKey = (topic || 'addition').toLowerCase();
  const timing = TIMING_CONFIG[topicKey] || { fp: 4, zp: 12 };

  // Calculate Streak Multiplier (e.g. 1.0x, 1.1x up to max 2.0x)
  const streakMultiplier = Math.min(
    SCORING_CONFIG.maxStreakMultiplier,
    1 + (currentStreak * SCORING_CONFIG.streakMultiplierStep)
  );

  // Maximum possible points for this question
  const maxPossiblePoints = SCORING_CONFIG.basePoints * streakMultiplier;

  let percentageRemaining = 0;

  if (timeTakenSeconds <= timing.fp) {
    percentageRemaining = 1.0;
  } else if (timeTakenSeconds >= timing.zp) {
    percentageRemaining = 0.0;
  } else {
    // Linear percentage decay from 100% at fp down to 0% at zp
    percentageRemaining = 1.0 - ((timeTakenSeconds - timing.fp) / (timing.zp - timing.fp));
  }

  // Calculate points earned: percentage of max points floored to nearest integer
  const pointsEarned = Math.floor(maxPossiblePoints * percentageRemaining);

  return {
    pointsEarned,
    percentageRemaining: Math.round(percentageRemaining * 100),
    timeTakenSeconds: Math.round(timeTakenSeconds * 10) / 10
  };
}
