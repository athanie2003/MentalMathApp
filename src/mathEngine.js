// Math Question Generator Engine for Addition, Subtraction, Multiplication, Division, and BEDMAS
import { ALL_CATEGORIES } from './gameConfig.js';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roundToDecimals(num, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

export function generateQuestion(topic, difficulty = 'medium', allowDecimals = false) {
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
      return generateAddition(targetDifficulty, allowDecimals);
    case 'subtraction':
      return generateSubtraction(targetDifficulty, allowDecimals);
    case 'multiplication':
      return generateMultiplication(targetDifficulty, allowDecimals);
    case 'division':
      return generateDivision(targetDifficulty, allowDecimals);
    case 'bedmas':
      return generateBEDMAS(targetDifficulty, allowDecimals);
    default:
      return generateAddition(targetDifficulty, allowDecimals);
  }
}

function generateAddition(difficulty, allowDecimals) {
  let a, b;
  if (difficulty === 'easy' || !allowDecimals) {
    if (difficulty === 'easy') {
      a = randomInt(2, 20);
      b = randomInt(2, 20);
    } else if (difficulty === 'medium') {
      a = randomInt(15, 99);
      b = randomInt(15, 99);
    } else {
      a = randomInt(100, 999);
      b = randomInt(100, 999);
    }
  } else if (difficulty === 'medium' && allowDecimals) {
    // 1 Decimal Place
    const useDecimal = Math.random() > 0.5;
    if (useDecimal) {
      a = roundToDecimals(randomInt(10, 99) / 10, 1);
      b = roundToDecimals(randomInt(10, 99) / 10, 1);
    } else {
      a = randomInt(15, 99);
      b = randomInt(15, 99);
    }
  } else {
    // Hard + allowDecimals -> 2 Decimal Places
    const useDecimal = Math.random() > 0.5;
    if (useDecimal) {
      a = roundToDecimals(randomInt(100, 999) / 100, 2);
      b = roundToDecimals(randomInt(100, 999) / 100, 2);
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

function generateSubtraction(difficulty, allowDecimals) {
  let a, b;
  if (difficulty === 'easy' || !allowDecimals) {
    if (difficulty === 'easy') {
      a = randomInt(10, 30);
      b = randomInt(2, a);
    } else if (difficulty === 'medium') {
      a = randomInt(25, 120);
      b = randomInt(10, a);
    } else {
      a = randomInt(150, 999);
      b = randomInt(50, a);
    }
  } else if (difficulty === 'medium' && allowDecimals) {
    // 1 Decimal Place
    const useDecimal = Math.random() > 0.5;
    if (useDecimal) {
      a = roundToDecimals(randomInt(50, 199) / 10, 1);
      b = roundToDecimals(randomInt(10, Math.floor(a * 10)) / 10, 1);
    } else {
      a = randomInt(25, 120);
      b = randomInt(10, a);
    }
  } else {
    // Hard + allowDecimals -> 2 Decimal Places
    const useDecimal = Math.random() > 0.5;
    if (useDecimal) {
      a = roundToDecimals(randomInt(500, 1999) / 100, 2);
      b = roundToDecimals(randomInt(100, Math.floor(a * 100)) / 100, 2);
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

function generateMultiplication(difficulty, allowDecimals) {
  let a, b;
  if (difficulty === 'easy' || !allowDecimals) {
    if (difficulty === 'easy') {
      a = randomInt(2, 10);
      b = randomInt(2, 10);
    } else if (difficulty === 'medium') {
      a = randomInt(4, 15);
      b = randomInt(4, 15);
    } else {
      a = randomInt(12, 25);
      b = randomInt(11, 20);
    }
  } else if (difficulty === 'medium' && allowDecimals) {
    // 1 Decimal Place
    const useDecimal = Math.random() > 0.5;
    if (useDecimal) {
      a = roundToDecimals(randomInt(15, 60) / 10, 1);
      b = randomInt(2, 12);
    } else {
      a = randomInt(4, 15);
      b = randomInt(4, 15);
    }
  } else {
    // Hard + allowDecimals -> 2 Decimal Places
    const useDecimal = Math.random() > 0.5;
    if (useDecimal) {
      a = roundToDecimals(randomInt(110, 450) / 100, 2);
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

function generateDivision(difficulty, allowDecimals) {
  let divisor, quotient, dividend;
  
  if (difficulty === 'easy' || !allowDecimals) {
    if (difficulty === 'easy') {
      divisor = randomInt(2, 10);
      quotient = randomInt(2, 10);
    } else if (difficulty === 'medium') {
      divisor = randomInt(3, 12);
      quotient = randomInt(5, 15);
    } else {
      divisor = randomInt(6, 20);
      quotient = randomInt(12, 35);
    }
    dividend = divisor * quotient;
    return {
      expression: `${dividend} ÷ ${divisor}`,
      answer: quotient,
      topic: 'Division',
      rawTopic: 'division',
      difficulty: difficulty,
      hint: 'Divide the dividend by the divisor.'
    };
  } else if (difficulty === 'medium' && allowDecimals) {
    // 1 Decimal Place (33% chance)
    const type = randomInt(1, 3);
    if (type === 1) {
      divisor = 2; // dividing by 2 yields .5
      dividend = randomInt(3, 35) * 2 + 1; // odd number divided by 2 -> .5
      const answer = roundToDecimals(dividend / divisor, 1);
      return {
        expression: `${dividend} ÷ ${divisor}`,
        answer: answer,
        topic: 'Division',
        rawTopic: 'division',
        difficulty: difficulty,
        hint: 'Calculate the quotient (includes 1 decimal place).'
      };
    } else {
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
    }
  } else {
    // Hard + allowDecimals -> 2 Decimal Places (33% chance)
    const type = randomInt(1, 3);
    if (type === 1) {
      divisor = 4; // dividing by 4 yields .25 or .75
      const oddBase = randomInt(2, 20) * 4 + (Math.random() > 0.5 ? 1 : 3);
      dividend = oddBase;
      const answer = roundToDecimals(dividend / divisor, 2);
      return {
        expression: `${dividend} ÷ ${divisor}`,
        answer: answer,
        topic: 'Division',
        rawTopic: 'division',
        difficulty: difficulty,
        hint: 'Calculate the quotient (includes up to 2 decimal places).'
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

function generateBEDMAS(difficulty, allowDecimals) {
  const templates = [];

  if (difficulty === 'easy' || !allowDecimals) {
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
        return {
          expr: `(${a} × ${b}) − (${c} × ${d})`,
          ans: (a * b) - (c * d),
          explanation: `Brackets first: (${a}×${b})=${a*b} and (${c}×${d})=${c*d}. Subtract: ${a*b} − ${c*d} = ${(a*b) - (c*d)}`
        };
      });
    }
  } else if (difficulty === 'medium' && allowDecimals) {
    // 1 Decimal Place BEDMAS
    templates.push(() => {
      const a = roundToDecimals(randomInt(10, 50) / 10, 1);
      const b = roundToDecimals(randomInt(10, 50) / 10, 1);
      const c = randomInt(2, 5);
      const sum = roundToDecimals(a + b, 1);
      return {
        expr: `(${a} + ${b}) × ${c}`,
        ans: roundToDecimals(sum * c, 1),
        explanation: `Brackets first: ${a} + ${b} = ${sum}. Then multiply: ${sum} × ${c} = ${roundToDecimals(sum * c, 1)}`
      };
    });
    templates.push(() => {
      const a = randomInt(10, 30);
      const b = roundToDecimals(randomInt(15, 45) / 10, 1);
      const c = 2;
      const mult = roundToDecimals(b * c, 1);
      return {
        expr: `${a} − ${b} × ${c}`,
        ans: roundToDecimals(a - mult, 1),
        explanation: `Multiply first: ${b} × ${c} = ${mult}. Subtract: ${a} − ${mult} = ${roundToDecimals(a - mult, 1)}`
      };
    });
  } else {
    // Hard + allowDecimals -> 2 Decimal Places BEDMAS
    templates.push(() => {
      const a = roundToDecimals(randomInt(100, 300) / 100, 2);
      const b = roundToDecimals(randomInt(100, 300) / 100, 2);
      const c = randomInt(2, 4);
      const sum = roundToDecimals(a + b, 2);
      return {
        expr: `(${a} + ${b}) × ${c}`,
        ans: roundToDecimals(sum * c, 2),
        explanation: `Brackets: ${a} + ${b} = ${sum}. Multiply: ${sum} × ${c} = ${roundToDecimals(sum * c, 2)}`
      };
    });
    templates.push(() => {
      const a = roundToDecimals(randomInt(2000, 5000) / 100, 2);
      const b = roundToDecimals(randomInt(150, 450) / 100, 2);
      const c = 2;
      const mult = roundToDecimals(b * c, 2);
      return {
        expr: `${a} − ${b} × ${c}`,
        ans: roundToDecimals(a - mult, 2),
        explanation: `Multiply first: ${b} × ${c} = ${mult}. Subtract: ${a} − ${mult} = ${roundToDecimals(a - mult, 2)}`
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
