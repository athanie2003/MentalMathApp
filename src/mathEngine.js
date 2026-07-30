// Math Question Generator Engine for Addition, Subtraction, Multiplication, Division, BEDMAS, and Percentage
import { ALL_CATEGORIES } from './gameConfig.js';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roundToDecimals(num, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * Main Question Generator
 * @param {string} topic - 'addition', 'subtraction', 'multiplication', 'division', 'bedmas', 'percentage', 'mix'
 * @param {string} difficulty - 'easy', 'medium', 'hard', 'random'
 * @param {string[]} numberTypes - Array of selected types: ['integers', 'decimals', 'negatives'] or ['all']
 */
export function generateQuestion(topic, difficulty = 'medium', numberTypes = ['integers']) {
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

  // Determine active number types
  let activeTypes = [...numberTypes];
  if (activeTypes.includes('all')) {
    activeTypes = ['integers', 'decimals', 'negatives'];
  }
  if (activeTypes.length === 0) {
    activeTypes = ['integers'];
  }

  // Pick a random number type for this question from active choices
  const chosenType = activeTypes[Math.floor(Math.random() * activeTypes.length)];

  switch (targetTopic) {
    case 'addition':
      return generateAddition(targetDifficulty, chosenType);
    case 'subtraction':
      return generateSubtraction(targetDifficulty, chosenType);
    case 'multiplication':
      return generateMultiplication(targetDifficulty, chosenType);
    case 'division':
      return generateDivision(targetDifficulty, chosenType);
    case 'bedmas':
      return generateBEDMAS(targetDifficulty, chosenType);
    case 'percentage':
      return generatePercentage(targetDifficulty, chosenType);
    default:
      return generateAddition(targetDifficulty, chosenType);
  }
}

function generateAddition(difficulty, chosenType) {
  let a, b;
  const isDecimal = chosenType === 'decimals';
  const isNegative = chosenType === 'negatives';

  if (!isDecimal) {
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

    if (isNegative) {
      if (Math.random() > 0.5) a = -a;
      else b = -b;
    }
  } else if (difficulty === 'medium' && isDecimal) {
    // 1 Decimal Place
    a = roundToDecimals(randomInt(10, 99) / 10, 1);
    b = roundToDecimals(randomInt(10, 99) / 10, 1);
  } else {
    // Hard + Decimals -> 2 Decimal Places
    a = roundToDecimals(randomInt(100, 999) / 100, 2);
    b = roundToDecimals(randomInt(100, 999) / 100, 2);
  }

  const answer = roundToDecimals(a + b, 2);
  const exprB = b < 0 ? `(${b})` : `${b}`;
  const exprA = a < 0 ? `(${a})` : `${a}`;

  return {
    expression: `${exprA} + ${exprB}`,
    answer: answer,
    topic: 'Addition',
    rawTopic: 'addition',
    difficulty: difficulty,
    hint: 'Add the two numbers together.'
  };
}

function generateSubtraction(difficulty, chosenType) {
  let a, b;
  const isDecimal = chosenType === 'decimals';
  const isNegative = chosenType === 'negatives';

  if (!isDecimal) {
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

    if (isNegative) {
      if (Math.random() > 0.5) a = -a;
      else b = -b;
    }
  } else if (difficulty === 'medium' && isDecimal) {
    // 1 Decimal Place
    a = roundToDecimals(randomInt(50, 199) / 10, 1);
    b = roundToDecimals(randomInt(10, Math.floor(a * 10)) / 10, 1);
  } else {
    // Hard + Decimals -> 2 Decimal Places
    a = roundToDecimals(randomInt(500, 1999) / 100, 2);
    b = roundToDecimals(randomInt(100, Math.floor(a * 100)) / 100, 2);
  }

  const answer = roundToDecimals(a - b, 2);
  const exprB = b < 0 ? `(${b})` : `${b}`;
  const exprA = a < 0 ? `(${a})` : `${a}`;

  return {
    expression: `${exprA} − ${exprB}`,
    answer: answer,
    topic: 'Subtraction',
    rawTopic: 'subtraction',
    difficulty: difficulty,
    hint: 'Subtract the second number from the first.'
  };
}

function generateMultiplication(difficulty, chosenType) {
  let a, b;
  const isDecimal = chosenType === 'decimals';
  const isNegative = chosenType === 'negatives';

  if (!isDecimal) {
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

    if (isNegative) {
      if (Math.random() > 0.5) a = -a;
      else b = -b;
    }
  } else if (difficulty === 'medium' && isDecimal) {
    // 1 Decimal Place
    a = roundToDecimals(randomInt(15, 60) / 10, 1);
    b = randomInt(2, 12);
  } else {
    // Hard + Decimals -> 2 Decimal Places
    a = roundToDecimals(randomInt(110, 450) / 100, 2);
    b = randomInt(2, 12);
  }

  const answer = roundToDecimals(a * b, 2);
  const exprB = b < 0 ? `(${b})` : `${b}`;
  const exprA = a < 0 ? `(${a})` : `${a}`;

  return {
    expression: `${exprA} × ${exprB}`,
    answer: answer,
    topic: 'Multiplication',
    rawTopic: 'multiplication',
    difficulty: difficulty,
    hint: 'Multiply the numbers.'
  };
}

function generateDivision(difficulty, chosenType) {
  let divisor, quotient, dividend;
  const isDecimal = chosenType === 'decimals';
  const isNegative = chosenType === 'negatives';

  if (!isDecimal) {
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

    if (isNegative) {
      if (Math.random() > 0.5) dividend = -dividend;
      else divisor = -divisor;
      quotient = roundToDecimals(dividend / divisor, 2);
    }

    const exprDivisor = divisor < 0 ? `(${divisor})` : `${divisor}`;
    const exprDividend = dividend < 0 ? `(${dividend})` : `${dividend}`;

    return {
      expression: `${exprDividend} ÷ ${exprDivisor}`,
      answer: quotient,
      topic: 'Division',
      rawTopic: 'division',
      difficulty: difficulty,
      hint: 'Divide the dividend by the divisor.'
    };
  } else if (difficulty === 'medium' && isDecimal) {
    // 1 Decimal Place (.5)
    divisor = 2;
    dividend = randomInt(3, 35) * 2 + 1;
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
    // Hard + Decimals -> 2 Decimal Places (.25 or .75)
    divisor = 4;
    dividend = randomInt(2, 20) * 4 + (Math.random() > 0.5 ? 1 : 3);
    const answer = roundToDecimals(dividend / divisor, 2);
    return {
      expression: `${dividend} ÷ ${divisor}`,
      answer: answer,
      topic: 'Division',
      rawTopic: 'division',
      difficulty: difficulty,
      hint: 'Calculate the quotient (includes up to 2 decimal places).'
    };
  }
}

function generateBEDMAS(difficulty, chosenType) {
  const isDecimal = chosenType === 'decimals';
  const isNegative = chosenType === 'negatives';
  const templates = [];

  if (!isDecimal) {
    if (difficulty === 'easy') {
      templates.push(() => {
        let a = randomInt(2, 10);
        let b = randomInt(2, 10);
        let c = randomInt(2, 10);
        if (isNegative) a = -a;
        return {
          expr: `(${a} + ${b}) × ${c}`,
          ans: (a + b) * c,
          explanation: `Calculate inside brackets: ${a} + ${b} = ${a + b}. Multiply: ${a + b} × ${c} = ${(a + b) * c}`
        };
      });
      templates.push(() => {
        let a = randomInt(10, 30);
        let b = randomInt(2, 6);
        let c = randomInt(2, 5);
        if (isNegative) b = -b;
        const exprB = b < 0 ? `(${b})` : `${b}`;
        return {
          expr: `${a} − ${exprB} × ${c}`,
          ans: a - (b * c),
          explanation: `Multiplication first: ${b} × ${c} = ${b * c}. Subtract: ${a} − (${b * c}) = ${a - (b * c)}`
        };
      });
    } else if (difficulty === 'medium') {
      templates.push(() => {
        let a = randomInt(2, 5);
        let b = randomInt(2, 12);
        if (isNegative) b = -b;
        const exprB = b < 0 ? `(${b})` : `${b}`;
        return {
          expr: `${a}² + ${exprB}`,
          ans: Math.pow(a, 2) + b,
          explanation: `Exponents first: ${a}² = ${Math.pow(a, 2)}. Add: ${Math.pow(a, 2)} + (${b}) = ${Math.pow(a, 2) + b}`
        };
      });
      templates.push(() => {
        const multVal = randomInt(4, 10);
        const b = randomInt(2, 6);
        let dividend = multVal * b;
        let c = randomInt(5, 20);
        if (isNegative) c = -c;
        const exprC = c < 0 ? `(${c})` : `${c}`;
        return {
          expr: `${dividend} ÷ ${b} + ${exprC}`,
          ans: multVal + c,
          explanation: `Division first: ${dividend} ÷ ${b} = ${multVal}. Add: ${multVal} + (${c}) = ${multVal + c}`
        };
      });
    } else {
      templates.push(() => {
        let base = randomInt(2, 4);
        let b = randomInt(3, 8);
        let c = randomInt(2, 5);
        if (isNegative) b = -b;
        const expVal = Math.pow(base, 3);
        const multVal = b * c;
        const exprB = b < 0 ? `(${b})` : `${b}`;
        return {
          expr: `${base}³ + ${exprB} × ${c}`,
          ans: expVal + multVal,
          explanation: `Exponent: ${base}³ = ${expVal}. Multiply: ${b} × ${c} = ${multVal}. Add: ${expVal} + (${multVal}) = ${expVal + multVal}`
        };
      });
      templates.push(() => {
        let a = randomInt(5, 15);
        let b = randomInt(2, 6);
        let c = randomInt(2, 4);
        let d = randomInt(1, 10);
        if (isNegative) a = -a;
        const p1 = a * b;
        const p2 = c * d;
        const exprA = a < 0 ? `(${a})` : `${a}`;
        return {
          expr: `(${exprA} × ${b}) − (${c} × ${d})`,
          ans: p1 - p2,
          explanation: `Brackets first: (${exprA}×${b})=${p1} and (${c}×${d})=${p2}. Subtract: ${p1} − ${p2} = ${p1 - p2}`
        };
      });
    }
  } else if (difficulty === 'medium' && isDecimal) {
    templates.push(() => {
      const a = roundToDecimals(randomInt(10, 50) / 10, 1);
      const b = roundToDecimals(randomInt(10, 50) / 10, 1);
      const c = randomInt(2, 5);
      const sum = roundToDecimals(a + b, 1);
      return {
        expr: `(${a} + ${b}) × ${c}`,
        ans: roundToDecimals(sum * c, 1),
        explanation: `Brackets first: ${a} + ${b} = ${sum}. Multiply: ${sum} × ${c} = ${roundToDecimals(sum * c, 1)}`
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
    // Hard + Decimals
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

function generatePercentage(difficulty, chosenType) {
  let percent, baseNum, answer;

  if (difficulty === 'easy') {
    const easyPercents = [10, 20, 25, 50, 100];
    percent = easyPercents[Math.floor(Math.random() * easyPercents.length)];
    const bases = [10, 20, 40, 50, 60, 80, 100, 120, 150, 200, 400];
    baseNum = bases[Math.floor(Math.random() * bases.length)];
    
    // Adjust baseNum so percent * baseNum / 100 yields an integer
    if (percent === 25 && baseNum % 4 !== 0) baseNum = randomInt(1, 20) * 4;
    if (percent === 50 && baseNum % 2 !== 0) baseNum = randomInt(1, 25) * 2;
    if ((percent === 10 || percent === 20) && baseNum % 10 !== 0) baseNum = randomInt(1, 25) * 10;
    
    answer = roundToDecimals((percent * baseNum) / 100, 2);
  } else if (difficulty === 'medium') {
    const medPercents = [5, 10, 15, 20, 25, 30, 40, 50, 75];
    percent = medPercents[Math.floor(Math.random() * medPercents.length)];
    baseNum = randomInt(2, 40) * 5;
    answer = roundToDecimals((percent * baseNum) / 100, 2);
  } else {
    // Hard difficulty -> results in up to 2 decimal places
    const hardPercents = [3, 7, 12, 14, 15, 18, 22, 35, 45, 65, 85];
    percent = hardPercents[Math.floor(Math.random() * hardPercents.length)];
    baseNum = randomInt(12, 250);
    answer = roundToDecimals((percent * baseNum) / 100, 2);
  }

  return {
    expression: `${percent}% of ${baseNum}`,
    answer: answer,
    topic: 'Percentage',
    rawTopic: 'percentage',
    difficulty: difficulty,
    hint: `Calculate ${percent}% of ${baseNum}. Hint: ${percent}% = ${percent}/100.`
  };
}
