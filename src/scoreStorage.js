const STORAGE_KEY = 'mental_math_high_scores_v3';

/**
 * Get all high scores from localStorage
 * Structure: { [topic]: { integers: number, decimals: number, opt2: number, decimals_opt2: number, all: number } }
 */
export function getAllHighScores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read high scores from localStorage', e);
    return {};
  }
}

/**
 * Map active types array to distinct variant strings:
 * - 'all': both decimals and option 2 enabled (All Types Mixed)
 * - 'decimals': decimals enabled
 * - 'opt2': negatives / over100 / multistep enabled
 * - 'integers': pure whole numbers (no checkboxes selected)
 * @param {string[]} activeTypes
 */
export function getVariantFromTypes(activeTypes = []) {
  if (activeTypes.includes('all')) return 'all';

  const hasDecimals = activeTypes.includes('decimals');
  const hasOpt2 = activeTypes.includes('negatives') || 
                  activeTypes.includes('over100') || 
                  activeTypes.includes('multistep');

  if (hasDecimals && hasOpt2) return 'all';
  if (hasDecimals) return 'decimals';
  if (hasOpt2) return 'opt2';
  return 'integers';
}

/**
 * Human-readable label for a variant
 */
export function getVariantLabel(variant = 'integers', topic = 'addition') {
  if (variant === 'all' || variant === 'decimals_opt2') return '🎲 All Types Mixed';
  if (variant === 'decimals') return '💡 Include Decimals';
  if (variant === 'opt2') {
    if (topic === 'percentage') return '📈 Include Over 100%';
    if (topic === 'money') return '🧾 Multi-Step Totals';
    return '➖ Include Negatives';
  }
  return '🟢 Whole Numbers (Integers)';
}

/**
 * Get high score for a specific topic and number variant
 * @param {string} topic - e.g. 'addition', 'percentage', 'mix'
 * @param {string} variant - 'integers', 'decimals', 'opt2', or 'all'
 */
export function getHighScore(topic, variant = 'integers') {
  const scores = getAllHighScores();
  if (scores[topic]) {
    if (variant === 'all') {
      const allScore = scores[topic]['all'] || 0;
      const decOpt2Score = scores[topic]['decimals_opt2'] || 0;
      return Math.max(allScore, decOpt2Score);
    }
    if (typeof scores[topic][variant] === 'number') {
      return scores[topic][variant];
    }
  }
  return 0;
}

/**
 * Save high score if it beats the existing record
 * @param {string} topic - e.g. 'addition'
 * @param {string} variant - 'integers', 'decimals', 'opt2', or 'all'
 * @param {number} newScore
 * @returns {{ isNewPB: boolean, oldPB: number, newPB: number }}
 */
export function saveHighScore(topic, variant = 'integers', newScore = 0) {
  const scores = getAllHighScores();
  if (!scores[topic]) {
    scores[topic] = { integers: 0, decimals: 0, opt2: 0, decimals_opt2: 0, all: 0 };
  }

  const currentPB = getHighScore(topic, variant);
  if (newScore > currentPB) {
    scores[topic][variant] = newScore;
    if (variant === 'all') {
      scores[topic]['decimals_opt2'] = newScore;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch (e) {
      console.warn('Could not save high score to localStorage', e);
    }
    return { isNewPB: true, oldPB: currentPB, newPB: newScore };
  }

  return { isNewPB: false, oldPB: currentPB, newPB: currentPB };
}
