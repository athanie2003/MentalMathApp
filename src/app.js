import confetti from 'canvas-confetti';
import { generateQuestion } from './mathEngine.js';
import { sounds } from './audio.js';

// DOM Elements
const screenMenu = document.getElementById('screen-menu');
const screenGame = document.getElementById('screen-game');

const topicCards = document.querySelectorAll('.topic-card');
const diffBtns = document.querySelectorAll('.diff-btn');
const btnStartPractice = document.getElementById('btn-start-practice');

const btnExitGame = document.getElementById('btn-exit-game');
const gameTopicBadge = document.getElementById('game-topic-badge');
const streakCountEl = document.getElementById('streak-count');
const livesPillEl = document.getElementById('lives-pill');
const btnToggleSoundMenu = document.getElementById('btn-toggle-sound-menu');
const btnToggleSoundGame = document.getElementById('btn-toggle-sound-game');
const soundIcons = document.querySelectorAll('.sound-icon');

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
  selectedTopic: 'addition',
  selectedDifficulty: 'medium',
  currentQuestion: null,
  userAnswerInput: '',
  lives: 3,
  streak: 0,
  isMuted: false
};

// INITIALIZATION
function init() {
  setupEventListeners();
  registerServiceWorker();
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
}

function setupEventListeners() {
  // Topic selection
  topicCards.forEach(card => {
    card.addEventListener('click', () => {
      sounds.playClick();
      topicCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.selectedTopic = card.dataset.topic;
    });
  });

  // Difficulty selection
  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      diffBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedDifficulty = btn.dataset.diff;
    });
  });

  // Start practice button
  btnStartPractice.addEventListener('click', () => {
    sounds.playClick();
    startPracticeSession();
  });

  // Exit button
  btnExitGame.addEventListener('click', () => {
    sounds.playClick();
    exitToMenu();
  });

  // Mute toggles
  [btnToggleSoundMenu, btnToggleSoundGame].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        state.isMuted = sounds.toggleMute();
        soundIcons.forEach(icon => {
          icon.textContent = state.isMuted ? '🔇' : '🔊';
        });
      });
    }
  });

  // Keypad clicks
  document.querySelectorAll('.key-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      handleKeyPress(key);
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

// NAVIGATION & SESSION CONTROL
function startPracticeSession() {
  state.streak = 0;
  state.lives = 3;
  streakCountEl.textContent = '0';
  updateLivesDisplay();

  const topicTitles = {
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    division: 'Division',
    bedmas: 'BEDMAS'
  };
  gameTopicBadge.textContent = topicTitles[state.selectedTopic] || 'Math';

  screenMenu.classList.remove('active');
  screenGame.classList.add('active');

  loadNextQuestion();
}

function exitToMenu() {
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

// QUESTION LOOP
function loadNextQuestion() {
  state.userAnswerInput = '';
  state.currentQuestion = generateQuestion(state.selectedTopic, state.selectedDifficulty);

  expressionDisplay.textContent = state.currentQuestion.expression;
  updateInputDisplay();
  questionCard.style.borderColor = 'var(--bg-card-border)';
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

// SUBMIT & GRADING
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
  sounds.playCorrect();
  questionCard.style.borderColor = 'var(--accent-success)';
  
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
  sounds.playWrong();
  questionCard.style.borderColor = 'var(--accent-danger)';

  // Decrement life for this wrong answer
  state.lives--;
  updateLivesDisplay();

  // Populate answer reveal modal
  modalCorrectAns.textContent = state.currentQuestion.answer;
  modalExplanationText.textContent = state.currentQuestion.hint || 'Review the math calculation step and try the next question!';

  if (state.lives <= 0) {
    modalTitleEl.textContent = 'Game Over 💔';
    btnModalOk.textContent = 'Return to Main Menu 🏠';
  } else {
    modalTitleEl.textContent = 'Incorrect';
    btnModalOk.textContent = 'OK / Next Question →';
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

document.addEventListener('DOMContentLoaded', init);
