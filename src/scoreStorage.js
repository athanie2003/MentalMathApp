const STORAGE_KEY = 'mental_math_high_scores_v1';

/**
 * Get all high scores from localStorage
 * Structure: { [topic]: { integers: number, decimals: number, opt2: number } }
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
 * Map active types array to variant string ('integers' | 'decimals' | 'opt2')
 * @param {string[]} activeTypes
 */
export function getVariantFromTypes(activeTypes = []) {
  if (activeTypes.includes('decimals')) {
    return 'decimals';
  }
  if (
    activeTypes.includes('negatives') ||
    activeTypes.includes('over100') ||
    activeTypes.includes('multistep')
  ) {
    return 'opt2';
  }
  return 'integers';
}

/**
 * Get high score for a specific topic and number variant
 * @param {string} topic - e.g. 'addition', 'percentage', 'mix'
 * @param {string} variant - 'integers', 'decimals', or 'opt2'
 */
export function getHighScore(topic, variant = 'integers') {
  const scores = getAllHighScores();
  if (scores[topic] && typeof scores[topic][variant] === 'number') {
    return scores[topic][variant];
  }
  return 0;
}

/**
 * Save high score if it beats the existing record
 * @param {string} topic - e.g. 'addition'
 * @param {string} variant - 'integers', 'decimals', 'opt2'
 * @param {number} newScore
 * @returns {{ isNewPB: boolean, oldPB: number, newPB: number }}
 */
export function saveHighScore(topic, variant = 'integers', newScore = 0) {
  const scores = getAllHighScores();
  if (!scores[topic]) {
    scores[topic] = { integers: 0, decimals: 0, opt2: 0 };
  }

  const currentPB = scores[topic][variant] || 0;
  if (newScore > currentPB) {
    scores[topic][variant] = newScore;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch (e) {
      console.warn('Could not save high score to localStorage', e);
    }
    return { isNewPB: true, oldPB: currentPB, newPB: newScore };
  }

  return { isNewPB: false, oldPB: currentPB, newPB: currentPB };
}
