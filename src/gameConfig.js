// Scalable Configuration File for Mental Math Modes, Timings, and Scoring

export const TIMING_CONFIG = {
  addition: { fp: 2, zp: 8 },         // Full Points <= 2s, Zero Speed Bonus >= 8s
  subtraction: { fp: 2, zp: 8 },      // Full Points <= 2s, Zero Speed Bonus >= 8s
  multiplication: { fp: 3, zp: 10 },  // Full Points <= 3s, Zero Speed Bonus >= 10s
  division: { fp: 4, zp: 12 },        // Full Points <= 4s, Zero Speed Bonus >= 12s
  bedmas: { fp: 8, zp: 20 }           // Full Points <= 8s, Zero Speed Bonus >= 20s
};

export const SCORING_CONFIG = {
  basePoints: 100,            // Base points for a correct answer
  maxSpeedBonus: 100,         // Max additional bonus points for speed
  streakMultiplierStep: 0.1,  // +10% score boost per streak level
  maxStreakMultiplier: 2.0    // Max 2x multiplier at 10 streak
};

export const ALL_CATEGORIES = ['addition', 'subtraction', 'multiplication', 'division', 'bedmas'];
