import { TIMING_CONFIG, SCORING_CONFIG } from './gameConfig.js';

/**
 * Calculates score for a correct answer in Challenge Mode based on speed and streak.
 * @param {string} topic - e.g. 'addition', 'subtraction', 'multiplication', 'division', 'bedmas'
 * @param {number} timeTakenSeconds - time in seconds
 * @param {number} currentStreak - current correct answer streak
 * @returns {object} { pointsEarned, speedBonus, speedPercent, timeTakenSeconds }
 */
export function calculateChallengeScore(topic, timeTakenSeconds, currentStreak = 0) {
  const topicKey = (topic || 'addition').toLowerCase();
  const timing = TIMING_CONFIG[topicKey] || { fp: 4, zp: 12 };

  let speedRatio = 0;
  if (timeTakenSeconds <= timing.fp) {
    speedRatio = 1.0;
  } else if (timeTakenSeconds >= timing.zp) {
    speedRatio = 0.0;
  } else {
    speedRatio = 1.0 - ((timeTakenSeconds - timing.fp) / (timing.zp - timing.fp));
  }

  const speedBonus = Math.round(speedRatio * SCORING_CONFIG.maxSpeedBonus);
  const streakMultiplier = Math.min(
    SCORING_CONFIG.maxStreakMultiplier,
    1 + (currentStreak * SCORING_CONFIG.streakMultiplierStep)
  );

  const rawScore = (SCORING_CONFIG.basePoints + speedBonus) * streakMultiplier;
  const pointsEarned = Math.round(rawScore);

  return {
    pointsEarned,
    speedBonus,
    speedPercent: Math.round(speedRatio * 100),
    timeTakenSeconds: Math.round(timeTakenSeconds * 10) / 10
  };
}
