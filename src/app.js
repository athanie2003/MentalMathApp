import confetti from 'canvas-confetti';
import { generateQuestion } from './mathEngine.js';
import { calculateChallengeScore } from './scoringEngine.js';
import { TIMING_CONFIG } from './gameConfig.js';
import { sounds } from './audio.js';

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
const typeNegatives = document.getElementById('type-negatives');

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

const modalFailed = document.getElementById('modal-failed');
const modalTitleEl = document.getElementById('modal-title-el');
const modalCorrectAns = document.getElementById('modal-correct-ans');
const modalExplanationText = document.getElementById('modal-explanation-text');
const btnModalOk = document.getElementById('btn-modal-ok');

// Application State
let state = {
  mode: 'practice', // 'practice' or 'challenge'
  selectedTopic: 'addition',
  selectedDifficulty: 'medium',
  selectedTypes: [], // optional add-ons: 'decimals', 'negatives'
  currentQuestion: null,
  userAnswerInput: '',
  lives: 3,
  streak: 0,
  totalScore: 0,
  questionStartTime: 0,
  timerInterval: null,
  isMuted: false
};

// Version Setup
const APP_VERSION = 'v1.3.3';
const SHOW_VERSION = true;

// INITIALIZATION
function init() {
  setupVersionBadge();
  setupEventListeners();
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
      screenMenu.classList.remove('active');
      screenConfig.classList.add('active');
    });
  }

  // Navigation: Step 2 -> Step 1 (Back to Menu)
  if (btnBackToMenu) {
    btnBackToMenu.addEventListener('click', () => {
      sounds.playClick();
      screenConfig.classList.remove('active');
      screenMenu.classList.add('active');
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

  // Number Types Checkboxes (Decimals & Negatives)
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

function setupCheckboxListeners() {
  [typeDecimals, typeNegatives].forEach(chk => {
    if (chk) {
      chk.addEventListener('change', () => {
        sounds.playClick();
        updateSelectedTypes();
      });
    }
  });
}

function updateSelectedTypes() {
  const selected = [];
  if (typeDecimals && typeDecimals.checked) selected.push('decimals');
  if (typeNegatives && typeNegatives.checked) selected.push('negatives');
  state.selectedTypes = selected;
}

function updateMenuUIForMode() {
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
  screenGame.classList.remove('active');
  screenMenu.classList.add('active');
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
    mix: 'Mix All'
  };
  
  const displayTopicName = state.selectedTopic === 'mix' 
    ? `Mix (${state.currentQuestion.topic})` 
    : (topicTitles[state.selectedTopic] || state.currentQuestion.topic);

  gameTopicBadge.textContent = displayTopicName;
  expressionDisplay.textContent = state.currentQuestion.expression;
  updateInputDisplay();
  questionCard.style.borderColor = 'var(--bg-card-border)';

  // Start question timer
  state.questionStartTime = Date.now();

  if (state.mode === 'challenge') {
    startTimerBar(state.currentQuestion.rawTopic);
  }
}

function startTimerBar(rawTopic) {
  const timing = TIMING_CONFIG[rawTopic] || { fp: 4, zp: 12 };
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
  if (!modalFailed.classList.contains('hidden')) return;

  sounds.playTap();

  if (key >= '0' && key <= '9') {
    if (state.userAnswerInput.length < 9) {
      state.userAnswerInput += key;
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

  if (state.lives <= 0) {
    modalTitleEl.textContent = state.mode === 'challenge' 
      ? `Game Over! Final Score: ${state.totalScore.toLocaleString()} 🏆`
      : 'Game Over 💔';
    btnModalOk.textContent = 'Main Menu';
  } else {
    modalTitleEl.textContent = 'Incorrect';
    btnModalOk.textContent = 'Next';
  }

  modalFailed.classList.remove('hidden');
}

function closeFailedModalAndNextQuestion() {
  modalFailed.classList.add('hidden');
  if (state.lives <= 0) {
    exitToMenu();
  } else {
    loadNextQuestion();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
