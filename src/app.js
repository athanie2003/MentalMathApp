import confetti from 'canvas-confetti';
import { generateQuestion } from './mathEngine.js';
import { calculateChallengeScore } from './scoringEngine.js';
import { getQuestionTiming } from './gameConfig.js';
import { sounds } from './audio.js';
import { getHighScore, saveHighScore, getVariantFromTypes, getVariantLabel } from './scoreStorage.js';

// DOM Elements & Screens
const screenMenu = document.getElementById('screen-menu');
const screenConfig = document.getElementById('screen-config');
const screenGame = document.getElementById('screen-game');

const modeBtns = document.querySelectorAll('.mode-btn');
const topicCards = document.querySelectorAll('.topic-card');
const cardMixTopic = document.getElementById('card-mix-topic');

const btnGotoConfig = document.getElementById('btn-goto-config');
const btnBackToMenu = document.getElementById('btn-back-to-menu');

const sectionDifficulty = document.getElementById('section-difficulty');
const diffBtns = document.querySelectorAll('.diff-btn');

const typeDecimals = document.getElementById('type-decimals');
const typeOpt2 = document.getElementById('type-opt2');
const titleOpt2 = document.getElementById('title-opt-2');
const typeAll = document.getElementById('type-all');

const configPbCard = document.getElementById('config-pb-card');
const pbCardTypeLabel = document.getElementById('pb-card-type-label');
const pbCardScoreVal = document.getElementById('pb-card-score-val');

const btnStartPractice = document.getElementById('btn-start-practice');
const btnStartText = document.getElementById('btn-start-text');

const btnExitGame = document.getElementById('btn-exit-game');
const gameModeBadge = document.getElementById('game-mode-badge');
const gameTopicBadge = document.getElementById('game-topic-badge');

const scorePill = document.getElementById('score-pill');
const scoreCountEl = document.getElementById('score-count');
const streakCountEl = document.getElementById('streak-count');
const livesPillEl = document.getElementById('lives-pill');

const btnToggleSoundMenu = document.getElementById('btn-toggle-sound-menu');
const btnToggleSoundConfig = document.getElementById('btn-toggle-sound-config');
const btnToggleSoundGame = document.getElementById('btn-toggle-sound-game');
const soundIcons = document.querySelectorAll('.sound-icon');

const timerBarWrapper = document.getElementById('timer-bar-wrapper');
const timerBarInner = document.getElementById('timer-bar-inner');

const expressionDisplay = document.getElementById('expression-display');
const inputPlaceholder = document.getElementById('input-placeholder');
const inputValueEl = document.getElementById('input-value');
const questionCard = document.getElementById('question-card');

// Answer Reveal Modal
const modalFailed = document.getElementById('modal-failed');
const modalTitleEl = document.getElementById('modal-title-el');
const modalCorrectAns = document.getElementById('modal-correct-ans');
const modalExplanationText = document.getElementById('modal-explanation-text');
const btnModalOk = document.getElementById('btn-modal-ok');

// Game Summary / High Score Modal
const modalSummary = document.getElementById('modal-summary');
const summaryTitleEl = document.getElementById('summary-title-el');
const summaryScoreVal = document.getElementById('summary-score-val');
const summaryPbBanner = document.getElementById('summary-pb-banner');
const summaryTopicName = document.getElementById('summary-topic-name');
const summaryPrevPb = document.getElementById('summary-prev-pb');
const btnSummaryMainMenu = document.getElementById('btn-summary-main-menu');

// Application State
let state = {
  mode: 'practice', // 'practice' or 'challenge'
  selectedTopic: 'addition',
  selectedDifficulty: 'medium',
  selectedTypes: [], // optional add-ons: 'decimals', 'negatives', 'over100', 'multistep', 'all'
  currentQuestion: null,
  userAnswerInput: '',
  lives: 3,
  streak: 0,
  totalScore: 0,
  questionStartTime: 0,
  timerInterval: null,
  isMuted: false,
  pendingGameOver: false
};

// Version Setup
const APP_VERSION = 'v1.8.0';
const SHOW_VERSION = true;

// INITIALIZATION
function init() {
  setupVersionBadge();
  setupEventListeners();
  renderHighScoresUI();
  registerServiceWorker();
}

function setupVersionBadge() {
  const versionBadge = document.getElementById('version-badge');
  if (versionBadge) {
    versionBadge.textContent = APP_VERSION;
    if (!SHOW_VERSION) {
      versionBadge.classList.add('hidden');
    }
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('ServiceWorker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.log('ServiceWorker registration failed: ', err);
      });
  }
}

function setupEventListeners() {
  // Mode selection (Practice vs Challenge)
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;
      updateMenuUIForMode();
    });
  });

  // Topic selection
  topicCards.forEach(card => {
    card.addEventListener('click', () => {
      sounds.playClick();
      topicCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.selectedTopic = card.dataset.topic;
    });
  });

  // Navigation: Step 1 -> Step 2 (Goto Config)
  if (btnGotoConfig) {
    btnGotoConfig.addEventListener('click', () => {
      sounds.playClick();
      updateStep2Options();
      screenMenu.classList.remove('active');
      screenConfig.classList.add('active');
      renderHighScoresUI();
    });
  }

  // Navigation: Step 2 -> Step 1 (Back to Menu)
  if (btnBackToMenu) {
    btnBackToMenu.addEventListener('click', () => {
      sounds.playClick();
      screenConfig.classList.remove('active');
      screenMenu.classList.add('active');
      renderHighScoresUI();
    });
  }

  // Difficulty selection
  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      diffBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedDifficulty = btn.dataset.diff;
    });
  });

  // Number Types Checkboxes
  setupCheckboxListeners();

  // Start Session Button (Step 2 -> Game)
  btnStartPractice.addEventListener('click', () => {
    sounds.playClick();
    startSession();
  });

  // Exit button (Game -> Menu)
  btnExitGame.addEventListener('click', () => {
    sounds.playClick();
    exitToMenu();
  });

  // Summary Modal Main Menu button
  if (btnSummaryMainMenu) {
    btnSummaryMainMenu.addEventListener('click', () => {
      sounds.playClick();
      modalSummary.classList.add('hidden');
      exitToMenu();
    });
  }

  // Mute toggles
  [btnToggleSoundMenu, btnToggleSoundConfig, btnToggleSoundGame].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        state.isMuted = sounds.toggleMute();
        soundIcons.forEach(icon => {
          icon.textContent = state.isMuted ? '🔇' : '🔊';
        });
      });
    }
  });

  // Keypad press listener (Single press execution)
  document.querySelectorAll('.key-btn').forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const key = btn.dataset.key;
      handleKeyPress(key);
    });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });

  // Keyboard support for physical keyboards
  window.addEventListener('keydown', (e) => {
    if (!screenGame.classList.contains('active')) return;

    if (e.key >= '0' && e.key <= '9') {
      handleKeyPress(e.key);
    } else if (e.key === '.' || e.key === ',') {
      handleKeyPress('.');
    } else if (e.key === 'Backspace') {
      handleKeyPress('BACKSPACE');
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
      handleKeyPress('CLEAR');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleKeyPress('ENTER');
    } else if (e.key === '-') {
      handleKeyPress('SIGN');
    }
  });

  // Modal OK / Next button click
  btnModalOk.addEventListener('click', () => {
    sounds.playClick();
    closeFailedModalAndNextQuestion();
  });
}

function updateStep2Options() {
  if (!titleOpt2) return;
  if (state.selectedTopic === 'percentage') {
    titleOpt2.textContent = '📈 Include Over 100%';
  } else if (state.selectedTopic === 'money') {
    titleOpt2.textContent = '🧾 Include Multi-Step Totals';
  } else {
    titleOpt2.textContent = '➖ Include Negative Numbers';
  }
}

function setupCheckboxListeners() {
  if (typeAll) {
    typeAll.addEventListener('change', () => {
      sounds.playClick();
      if (typeAll.checked) {
        if (typeDecimals) typeDecimals.checked = false;
        if (typeOpt2) typeOpt2.checked = false;
      }
      updateSelectedTypes();
      renderHighScoresUI();
    });
  }

  [typeDecimals, typeOpt2].forEach(chk => {
    if (chk) {
      chk.addEventListener('change', () => {
        sounds.playClick();
        if (chk.checked && typeAll) {
          typeAll.checked = false;
        }
        updateSelectedTypes();
        renderHighScoresUI();
      });
    }
  });
}

function updateSelectedTypes() {
  const selected = [];
  if (typeAll && typeAll.checked) {
    selected.push('all');
  } else {
    if (typeDecimals && typeDecimals.checked) selected.push('decimals');
    if (typeOpt2 && typeOpt2.checked) {
      if (state.selectedTopic === 'percentage') {
        selected.push('over100');
      } else if (state.selectedTopic === 'money') {
        selected.push('multistep');
      } else {
        selected.push('negatives');
      }
    }
  }
  state.selectedTypes = selected;
}

function renderHighScoresUI() {
  // Step 1: Topic Skill Cards show Pure Integers High Score
  const cardBadges = document.querySelectorAll('.card-pb-badge');
  cardBadges.forEach(badge => {
    const topic = badge.dataset.pbTopic;
    if (state.mode === 'challenge') {
      const score = getHighScore(topic, 'integers');
      badge.textContent = `🏆 ${score.toLocaleString()}`;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });

  // Step 2: High Score Card shows exact score for chosen skill + selected number types
  if (state.mode === 'challenge' && screenConfig.classList.contains('active')) {
    const variant = getVariantFromTypes(state.selectedTypes);
    const score = getHighScore(state.selectedTopic, variant);
    
    if (pbCardTypeLabel) {
      pbCardTypeLabel.textContent = getVariantLabel(variant, state.selectedTopic);
    }
    if (pbCardScoreVal) {
      pbCardScoreVal.textContent = score.toLocaleString();
    }
    if (configPbCard) {
      configPbCard.classList.remove('hidden');
    }
  } else {
    if (configPbCard) {
      configPbCard.classList.add('hidden');
    }
  }
}

function updateMenuUIForMode() {
  renderHighScoresUI();

  if (state.mode === 'challenge') {
    sectionDifficulty.classList.add('hidden');
    cardMixTopic.classList.remove('hidden');
    btnStartText.textContent = 'Start Challenge 🏆';
  } else {
    sectionDifficulty.classList.remove('hidden');
    cardMixTopic.classList.add('hidden');
    btnStartText.textContent = 'Start Practice ⚡';
    
    // If mix was selected, fallback to addition for practice mode
    if (state.selectedTopic === 'mix') {
      state.selectedTopic = 'addition';
      topicCards.forEach(c => {
        c.classList.toggle('active', c.dataset.topic === 'addition');
      });
    }
  }
}

// SESSION CONTROL
function startSession() {
  updateSelectedTypes();

  state.streak = 0;
  state.lives = 3;
  state.totalScore = 0;
  state.pendingGameOver = false;
  
  streakCountEl.textContent = '0';
  scoreCountEl.textContent = '0';
  updateLivesDisplay();

  // Set mode & topic badges
  gameModeBadge.textContent = state.mode === 'challenge' ? 'Challenge' : 'Practice';
  gameModeBadge.className = `game-badge ${state.mode === 'challenge' ? 'mode-tag' : ''}`;

  if (state.mode === 'challenge') {
    scorePill.classList.remove('hidden');
    timerBarWrapper.classList.remove('hidden');
  } else {
    scorePill.classList.add('hidden');
    timerBarWrapper.classList.add('hidden');
  }

  screenConfig.classList.remove('active');
  screenGame.classList.add('active');

  loadNextQuestion();
}

function exitToMenu() {
  stopTimerBar();
  modalFailed.classList.add('hidden');
  modalSummary.classList.add('hidden');
  screenGame.classList.remove('active');
  screenMenu.classList.add('active');
  renderHighScoresUI();
}

function updateLivesDisplay() {
  let hearts = '';
  for (let i = 0; i < 3; i++) {
    hearts += i < state.lives ? '❤️' : '🖤';
  }
  livesPillEl.textContent = hearts;
}

// QUESTION LOOP & TIMER
function loadNextQuestion() {
  stopTimerBar();

  state.userAnswerInput = '';
  const diffToUse = state.mode === 'challenge' ? 'random' : state.selectedDifficulty;

  // Pass active number type choices into generator
  const typesToPass = state.selectedTypes.length > 0 ? state.selectedTypes : ['integers'];
  state.currentQuestion = generateQuestion(state.selectedTopic, diffToUse, typesToPass);

  // Update Topic Badge Title
  const topicTitles = {
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    division: 'Division',
    bedmas: 'BEDMAS',
    percentage: 'Percentage',
    money: 'Money',
    mix: 'Mix All'
  };
  
  const displayTopicName = state.selectedTopic === 'mix' 
    ? `Mix (${state.currentQuestion.topic})` 
    : (topicTitles[state.selectedTopic] || state.currentQuestion.topic);

  gameTopicBadge.textContent = displayTopicName;
  expressionDisplay.textContent = state.currentQuestion.expression;
  updateInputDisplay();
  questionCard.style.borderColor = 'var(--bg-card-border)';

  // Start question timer based on topic & difficulty
  state.questionStartTime = Date.now();

  if (state.mode === 'challenge') {
    startTimerBar(state.currentQuestion.rawTopic, state.currentQuestion.difficulty);
  }
}

function startTimerBar(rawTopic, difficulty) {
  const timing = getQuestionTiming(rawTopic, difficulty);
  const totalDurationMs = timing.zp * 1000;
  
  timerBarInner.style.width = '100%';

  state.timerInterval = setInterval(() => {
    const elapsed = Date.now() - state.questionStartTime;
    const remainingRatio = Math.max(0, 1 - (elapsed / totalDurationMs));
    timerBarInner.style.width = `${remainingRatio * 100}%`;

    if (remainingRatio <= 0) {
      clearInterval(state.timerInterval);
    }
  }, 50);
}

function stopTimerBar() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function updateInputDisplay() {
  inputValueEl.textContent = state.userAnswerInput;
  if (state.userAnswerInput.length > 0) {
    inputPlaceholder.style.display = 'none';
  } else {
    inputPlaceholder.style.display = 'inline';
  }
}

// KEYPAD HANDLER
function handleKeyPress(key) {
  if (!modalFailed.classList.contains('hidden') || !modalSummary.classList.contains('hidden')) return;

  sounds.playTap();

  if (key >= '0' && key <= '9') {
    if (state.userAnswerInput === '0') {
      if (key !== '0') {
        state.userAnswerInput = key;
      }
    } else if (state.userAnswerInput === '-0') {
      if (key !== '0') {
        state.userAnswerInput = '-' + key;
      }
    } else {
      if (state.userAnswerInput.length < 9) {
        state.userAnswerInput += key;
      }
    }
  } else if (key === '.') {
    if (!state.userAnswerInput.includes('.')) {
      if (state.userAnswerInput === '' || state.userAnswerInput === '-') {
        state.userAnswerInput += '0.';
      } else {
        state.userAnswerInput += '.';
      }
    }
  } else if (key === 'SIGN') {
    if (state.userAnswerInput.startsWith('-')) {
      state.userAnswerInput = state.userAnswerInput.substring(1);
    } else {
      state.userAnswerInput = '-' + state.userAnswerInput;
    }
  } else if (key === 'BACKSPACE') {
    state.userAnswerInput = state.userAnswerInput.slice(0, -1);
  } else if (key === 'CLEAR') {
    state.userAnswerInput = '';
  } else if (key === 'ENTER') {
    submitAnswer();
    return;
  }

  updateInputDisplay();
}

// SUBMIT & SCORING
function submitAnswer() {
  if (state.userAnswerInput === '' || state.userAnswerInput === '-') return;

  const userNum = parseFloat(state.userAnswerInput);
  const correctNum = parseFloat(state.currentQuestion.answer);

  const isCorrect = Math.abs(userNum - correctNum) < 0.01;

  if (isCorrect) {
    handleCorrectAnswer();
  } else {
    handleIncorrectAnswer();
  }
}

function handleCorrectAnswer() {
  stopTimerBar();
  sounds.playCorrect();
  questionCard.style.borderColor = 'var(--accent-success)';
  
  if (state.mode === 'challenge') {
    const timeTakenSec = (Date.now() - state.questionStartTime) / 1000;
    const scoreResult = calculateChallengeScore(
      state.currentQuestion.rawTopic,
      state.currentQuestion.difficulty,
      timeTakenSec,
      state.streak
    );

    state.totalScore += scoreResult.pointsEarned;
    scoreCountEl.textContent = state.totalScore.toLocaleString();
  }

  state.streak++;
  streakCountEl.textContent = state.streak;

  if (state.streak > 0 && state.streak % 5 === 0) {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  }

  setTimeout(() => {
    loadNextQuestion();
  }, 500);
}

function handleIncorrectAnswer() {
  stopTimerBar();
  sounds.playWrong();
  questionCard.style.borderColor = 'var(--accent-danger)';

  // Reset streak to 0 on wrong answer
  state.streak = 0;
  streakCountEl.textContent = '0';

  state.lives--;
  updateLivesDisplay();

  modalCorrectAns.textContent = state.currentQuestion.answer;
  modalExplanationText.textContent = state.currentQuestion.hint || 'Review the math calculation step and try the next question!';

  modalTitleEl.textContent = 'Incorrect';
  btnModalOk.textContent = 'Next';

  if (state.lives <= 0) {
    state.pendingGameOver = true;
  }

  modalFailed.classList.remove('hidden');
}

function closeFailedModalAndNextQuestion() {
  modalFailed.classList.add('hidden');

  if (state.pendingGameOver) {
    state.pendingGameOver = false;

    if (state.mode === 'challenge') {
      // Open Score Summary Modal
      const variant = getVariantFromTypes(state.selectedTypes);
      const scoreResult = saveHighScore(state.selectedTopic, variant, state.totalScore);
      
      const topicTitles = {
        addition: 'Addition',
        subtraction: 'Subtraction',
        multiplication: 'Multiplication',
        division: 'Division',
        bedmas: 'BEDMAS',
        percentage: 'Percentage',
        money: 'Money',
        mix: 'Mix All'
      };

      summaryTopicName.textContent = topicTitles[state.selectedTopic] || state.selectedTopic;
      summaryScoreVal.textContent = state.totalScore.toLocaleString();
      summaryPrevPb.textContent = scoreResult.oldPB.toLocaleString();

      if (scoreResult.isNewPB && state.totalScore > 0) {
        summaryTitleEl.textContent = '🎉 NEW RECORD! 🎉';
        summaryPbBanner.classList.remove('hidden');
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } else {
        summaryTitleEl.textContent = 'Game Over';
        summaryPbBanner.classList.add('hidden');
      }

      modalSummary.classList.remove('hidden');
    } else {
      exitToMenu();
    }
  } else {
    loadNextQuestion();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
