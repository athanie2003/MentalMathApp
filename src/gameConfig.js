// Scalable Configuration File for Mental Math Modes, Timings, and Scoring

export const BASE_POINTS_CONFIG = {
  easy: 50,
  medium: 100,
  hard: 200
};

export const TIMING_CONFIG = {
  addition: {
    easy: { fp: 1.5, zp: 6 },
    medium: { fp: 2.5, zp: 9 },
    hard: { fp: 4.5, zp: 15 }
  },
  subtraction: {
    easy: { fp: 1.5, zp: 6 },
    medium: { fp: 2.5, zp: 9 },
    hard: { fp: 5.0, zp: 16 }
  },
  multiplication: {
    easy: { fp: 2.0, zp: 7 },
    medium: { fp: 3.5, zp: 11 },
    hard: { fp: 6.0, zp: 18 }
  },
  division: {
    easy: { fp: 2.5, zp: 8 },
    medium: { fp: 4.5, zp: 14 },
    hard: { fp: 7.5, zp: 22 }
  },
  bedmas: {
    easy: { fp: 5.0, zp: 15 },
    medium: { fp: 9.0, zp: 22 },
    hard: { fp: 14.0, zp: 32 }
  }
};

export const SCORING_CONFIG = {
  streakMultiplierStep: 0.1,  // +10% score boost per streak level
  maxStreakMultiplier: 2.0    // Max 2x multiplier at 10 streak
};

export const ALL_CATEGORIES = ['addition', 'subtraction', 'multiplication', 'division', 'bedmas'];

/**
 * Helper to get timing { fp, zp } for a specific topic and difficulty
 */
export function getQuestionTiming(topic, difficulty = 'medium') {
  const topicKey = (topic || 'addition').toLowerCase();
  const diffKey = (difficulty || 'medium').toLowerCase();
  const categoryTiming = TIMING_CONFIG[topicKey] || TIMING_CONFIG.addition;
  return categoryTiming[diffKey] || categoryTiming.medium || { fp: 3, zp: 10 };
}

/**
 * Helper to get base points for a specific difficulty
 */
export function getBasePoints(difficulty = 'medium') {
  const diffKey = (difficulty || 'medium').toLowerCase();
  return BASE_POINTS_CONFIG[diffKey] || 100;
}
