// Math Question Generator Engine for Addition, Subtraction, Multiplication, Division, and BEDMAS
import { ALL_CATEGORIES } from './gameConfig.js';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roundToDecimals(num, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

export function generateQuestion(topic, difficulty = 'medium') {
  let targetTopic = topic;
  let targetDifficulty = difficulty;

  // Handle 'mix' topic for Challenge Mode
  if (targetTopic === 'mix') {
    targetTopic = ALL_CATEGORIES[Math.floor(Math.random() * ALL_CATEGORIES.length)];
  }

  // Handle 'random' difficulty for Challenge Mode
  if (targetDifficulty === 'random') {
    const diffs = ['easy', 'medium', 'hard'];
    targetDifficulty = diffs[Math.floor(Math.random() * diffs.length)];
  }

  switch (targetTopic) {
    case 'addition':
      return generateAddition(targetDifficulty);
    case 'subtraction':
      return generateSubtraction(targetDifficulty);
    case 'multiplication':
      return generateMultiplication(targetDifficulty);
    case 'division':
      return generateDivision(targetDifficulty);
    case 'bedmas':
      return generateBEDMAS(targetDifficulty);
    default:
      return generateAddition(targetDifficulty);
  }
}

function generateAddition(difficulty) {
  let a, b;
  if (difficulty === 'easy') {
    a = randomInt(2, 20);
    b = randomInt(2, 20);
  } else if (difficulty === 'medium') {
    a = randomInt(15, 99);
    b = randomInt(15, 99);
  } else {
    const useDecimal = Math.random() > 0.5;
    if (useDecimal) {
      a = roundToDecimals(randomInt(10, 99) / 10, 1);
      b = roundToDecimals(randomInt(10, 99) / 10, 1);
    } else {
      a = randomInt(100, 999);
      b = randomInt(100, 999);
    }
  }

  const answer = roundToDecimals(a + b, 2);
  return {
    expression: `${a} + ${b}`,
    answer: answer,
    topic: 'Addition',
    rawTopic: 'addition',
    difficulty: difficulty,
    hint: 'Add the two numbers together.'
  };
}

function generateSubtraction(difficulty) {
  let a, b;
  if (difficulty === 'easy') {
    a = randomInt(10, 30);
    b = randomInt(2, a);
  } else if (difficulty === 'medium') {
    a = randomInt(25, 120);
    b = randomInt(10, a);
  } else {
    const useDecimal = Math.random() > 0.5;
    if (useDecimal) {
      a = roundToDecimals(randomInt(50, 199) / 10, 1);
      b = roundToDecimals(randomInt(10, Math.floor(a * 10)) / 10, 1);
    } else {
      a = randomInt(150, 999);
      b = randomInt(50, a);
    }
  }

  const answer = roundToDecimals(a - b, 2);
  return {
    expression: `${a} − ${b}`,
    answer: answer,
    topic: 'Subtraction',
    rawTopic: 'subtraction',
    difficulty: difficulty,
    hint: 'Subtract the second number from the first.'
  };
}

function generateMultiplication(difficulty) {
  let a, b;
  if (difficulty === 'easy') {
    a = randomInt(2, 10);
    b = randomInt(2, 10);
  } else if (difficulty === 'medium') {
    a = randomInt(4, 15);
    b = randomInt(4, 15);
  } else {
    const useDecimal = Math.random() > 0.5;
    if (useDecimal) {
      a = roundToDecimals(randomInt(15, 60) / 10, 1);
      b = randomInt(2, 12);
    } else {
      a = randomInt(12, 25);
      b = randomInt(11, 20);
    }
  }

  const answer = roundToDecimals(a * b, 2);
  return {
    expression: `${a} × ${b}`,
    answer: answer,
    topic: 'Multiplication',
    rawTopic: 'multiplication',
    difficulty: difficulty,
    hint: 'Multiply the numbers.'
  };
}

function generateDivision(difficulty) {
  let divisor, quotient, dividend;
  
  if (difficulty === 'easy') {
    divisor = randomInt(2, 10);
    quotient = randomInt(2, 10);
    dividend = divisor * quotient;
    return {
      expression: `${dividend} ÷ ${divisor}`,
      answer: quotient,
      topic: 'Division',
      rawTopic: 'division',
      difficulty: difficulty,
      hint: 'Divide the dividend by the divisor.'
    };
  } else if (difficulty === 'medium') {
    divisor = randomInt(3, 12);
    quotient = randomInt(5, 15);
    dividend = divisor * quotient;
    return {
      expression: `${dividend} ÷ ${divisor}`,
      answer: quotient,
      topic: 'Division',
      rawTopic: 'division',
      difficulty: difficulty,
      hint: 'Divide the dividend by the divisor.'
    };
  } else {
    const type = randomInt(1, 3);
    if (type === 1) {
      divisor = randomInt(2, 8) * 2;
      const base = randomInt(3, 25);
      dividend = base * (divisor / 2) + (divisor / 4);
      dividend = roundToDecimals(dividend, 2);
      const answer = roundToDecimals(dividend / divisor, 2);
      return {
        expression: `${dividend} ÷ ${divisor}`,
        answer: answer,
        topic: 'Division',
        rawTopic: 'division',
        difficulty: difficulty,
        hint: 'Calculate the quotient (may include decimals).'
      };
    } else {
      divisor = randomInt(6, 20);
      quotient = randomInt(12, 35);
      dividend = divisor * quotient;
      return {
        expression: `${dividend} ÷ ${divisor}`,
        answer: quotient,
        topic: 'Division',
        rawTopic: 'division',
        difficulty: difficulty,
        hint: 'Divide the dividend by the divisor.'
      };
    }
  }
}

function generateBEDMAS(difficulty) {
  const templates = [];

  if (difficulty === 'easy') {
    templates.push(() => {
      const a = randomInt(2, 10);
      const b = randomInt(2, 10);
      const c = randomInt(2, 10);
      return {
        expr: `(${a} + ${b}) × ${c}`,
        ans: (a + b) * c,
        explanation: `First calculate inside brackets: ${a} + ${b} = ${a + b}. Then multiply: ${a + b} × ${c} = ${(a + b) * c}`
      };
    });

    templates.push(() => {
      const a = randomInt(10, 30);
      const b = randomInt(2, 6);
      const c = randomInt(2, 5);
      return {
        expr: `${a} − ${b} × ${c}`,
        ans: a - (b * c),
        explanation: `Multiplication comes first: ${b} × ${c} = ${b * c}. Then subtract: ${a} − ${b * c} = ${a - (b * c)}`
      };
    });

    templates.push(() => {
      const a = randomInt(2, 10);
      const b = randomInt(2, 10);
      const c = randomInt(2, 10);
      return {
        expr: `${a} × ${b} + ${c}`,
        ans: (a * b) + c,
        explanation: `Multiplication comes first: ${a} × ${b} = ${a * b}. Then add: ${a * b} + ${c} = ${(a * b) + c}`
      };
    });
  } else if (difficulty === 'medium') {
    templates.push(() => {
      const a = randomInt(2, 5);
      const b = randomInt(2, 12);
      return {
        expr: `${a}² + ${b}`,
        ans: Math.pow(a, 2) + b,
        explanation: `Exponents first: ${a}² = ${Math.pow(a, 2)}. Then add: ${Math.pow(a, 2)} + ${b} = ${Math.pow(a, 2) + b}`
      };
    });

    templates.push(() => {
      const a = randomInt(20, 50);
      const b = randomInt(2, 8);
      const c = randomInt(2, 5);
      const mult = b * c;
      return {
        expr: `${a} − (${b} × ${c})`,
        ans: a - mult,
        explanation: `Brackets first: ${b} × ${c} = ${mult}. Then subtract: ${a} − ${mult} = ${a - mult}`
      };
    });

    templates.push(() => {
      const multVal = randomInt(4, 10);
      const b = randomInt(2, 6);
      const dividend = multVal * b;
      const c = randomInt(5, 20);
      return {
        expr: `${dividend} ÷ ${b} + ${c}`,
        ans: multVal + c,
        explanation: `Division first: ${dividend} ÷ ${b} = ${multVal}. Then add: ${multVal} + ${c} = ${multVal + c}`
      };
    });

    templates.push(() => {
      const a = randomInt(2, 8);
      const b = randomInt(2, 6);
      const c = randomInt(2, 5);
      const sub = randomInt(1, 10);
      return {
        expr: `(${a} + ${b}) × ${c} − ${sub}`,
        ans: ((a + b) * c) - sub,
        explanation: `Brackets: ${a} + ${b} = ${a + b}. Multiply: ${a + b} × ${c} = ${(a + b) * c}. Subtract: ${(a + b) * c} − ${sub} = ${((a + b) * c) - sub}`
      };
    });
  } else {
    templates.push(() => {
      const base = randomInt(2, 4);
      const b = randomInt(3, 8);
      const c = randomInt(2, 5);
      const expVal = Math.pow(base, 3);
      const multVal = b * c;
      return {
        expr: `${base}³ + ${b} × ${c}`,
        ans: expVal + multVal,
        explanation: `Exponent: ${base}³ = ${expVal}. Multiply: ${b} × ${c} = ${multVal}. Add: ${expVal} + ${multVal} = ${expVal + multVal}`
      };
    });

    templates.push(() => {
      const a = randomInt(5, 15);
      const b = randomInt(2, 6);
      const c = randomInt(2, 4);
      const d = randomInt(1, 10);
      const p1 = a * b;
      const p2 = c * d;
      return {
        expr: `(${a} × ${b}) − (${c} × ${d})`,
        ans: p1 - p2,
        explanation: `Brackets first: (${a}×${b})=${p1} and (${c}×${d})=${p2}. Subtract: ${p1} − ${p2} = ${p1 - p2}`
      };
    });

    templates.push(() => {
      const divRes = randomInt(4, 12);
      const divisor = randomInt(2, 6);
      const dividend = divRes * divisor;
      const b = randomInt(3, 9);
      const c = randomInt(2, 5);
      const multRes = b * c;
      return {
        expr: `${dividend} ÷ ${divisor} + ${b} × ${c}`,
        ans: divRes + multRes,
        explanation: `Divide & Multiply left-to-right: ${dividend}÷${divisor} = ${divRes}, ${b}×${c} = ${multRes}. Add: ${divRes} + ${multRes} = ${divRes + multRes}`
      };
    });
  }

  const selected = templates[Math.floor(Math.random() * templates.length)]();
  return {
    expression: selected.expr,
    answer: roundToDecimals(selected.ans, 2),
    topic: 'BEDMAS',
    rawTopic: 'bedmas',
    difficulty: difficulty,
    hint: selected.explanation || 'Follow Order of Operations: Brackets, Exponents, Division/Multiplication, Addition/Subtraction.'
  };
}
