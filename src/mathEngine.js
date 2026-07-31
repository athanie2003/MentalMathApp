// Math Question Generator Engine for Addition, Subtraction, Multiplication, Division, BEDMAS, Percentage, and Money
import { ALL_CATEGORIES } from './gameConfig.js';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roundToDecimals(num, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

function getIntegerBaseStep(percent) {
  if (percent % 100 === 0) return 1;
  if (percent % 50 === 0) return 2;
  if (percent % 25 === 0) return 4;
  if (percent % 20 === 0) return 5;
  if (percent % 10 === 0) return 10;
  if (percent % 5 === 0) return 20;
  if (percent % 4 === 0) return 25;
  if (percent % 2 === 0) return 50;
  return 100;
}

/**
 * Main Question Generator
 * @param {string} topic - 'addition', 'subtraction', 'multiplication', 'division', 'bedmas', 'percentage', 'money', 'mix'
 * @param {string} difficulty - 'easy', 'medium', 'hard', 'random'
 * @param {string[]} numberTypes - Array of selected types: ['integers', 'decimals', 'negatives', 'over100', 'multistep']
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
    activeTypes = ['integers', 'decimals', 'negatives', 'over100', 'multistep'];
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
      return generatePercentage(targetDifficulty, activeTypes);
    case 'money':
      return generateMoney(targetDifficulty, activeTypes);
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

function generatePercentage(difficulty, activeTypes = []) {
  const allowDecimals = activeTypes.includes('decimals');
  const allowOver100 = activeTypes.includes('over100');

  let percentPool = [];
  if (difficulty === 'easy') {
    percentPool = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 25, 75];
    if (allowOver100) {
      percentPool.push(110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 125, 175);
    }
  } else if (difficulty === 'medium') {
    percentPool = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 85, 90, 95, 100];
    if (allowOver100) {
      percentPool.push(105, 115, 120, 125, 135, 145, 150, 155, 165, 175, 185, 195, 200);
    }
  } else {
    // Hard difficulty
    percentPool = [3, 7, 12, 14, 15, 18, 22, 28, 33, 37, 42, 45, 63, 67, 72, 84, 88, 93];
    if (allowOver100) {
      percentPool.push(103, 112, 118, 127, 135, 138, 144, 156, 162, 178, 189, 194);
    }
  }

  const percent = percentPool[Math.floor(Math.random() * percentPool.length)];
  let baseNum, answer;

  if (!allowDecimals) {
    // Guaranteed exact integer answer without artificial rounding
    const step = getIntegerBaseStep(percent);
    baseNum = randomInt(1, 20) * step;
    answer = (percent * baseNum) / 100;
  } else if (difficulty === 'medium') {
    // Medium with decimals -> up to 1 decimal place
    baseNum = randomInt(3, 45) * 2;
    answer = roundToDecimals((percent * baseNum) / 100, 1);
  } else {
    // Hard with decimals -> up to 2 decimal places
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

function generateMoney(difficulty, activeTypes = []) {
  const allowDecimals = activeTypes.includes('decimals');
  const allowMultiStep = activeTypes.includes('multistep');

  const types = ['change', 'tip', 'discount', 'tax'];
  if (allowMultiStep) types.push('total_bill', 'final_price');

  const chosenScenario = types[Math.floor(Math.random() * types.length)];
  let expr = '', ans = 0, explanation = '';

  if (chosenScenario === 'change') {
    const bills = [10, 20, 50, 100];
    const bill = bills[Math.floor(Math.random() * bills.length)];
    let cost;

    if (!allowDecimals) {
      cost = randomInt(1, bill - 1);
    } else if (difficulty === 'easy') {
      const cents = [0.25, 0.50, 0.75];
      cost = randomInt(1, bill - 2) + cents[Math.floor(Math.random() * cents.length)];
    } else if (difficulty === 'medium') {
      cost = randomInt(1, bill - 2) + (randomInt(1, 19) * 0.05);
    } else {
      cost = randomInt(1, bill - 2) + (randomInt(1, 99) / 100);
    }
    cost = roundToDecimals(cost, 2);
    ans = roundToDecimals(bill - cost, 2);
    expr = `Change from $${bill} for $${cost.toFixed(2).replace('.00', '')}`;
    explanation = `Subtract item cost from cash paid: $${bill} − $${cost} = $${ans}`;

  } else if (chosenScenario === 'tip') {
    const tipPercents = difficulty === 'easy' ? [10, 20, 50] : (difficulty === 'medium' ? [10, 15, 20] : [15, 18, 20, 25]);
    const p = tipPercents[Math.floor(Math.random() * tipPercents.length)];
    let billVal;

    if (!allowDecimals) {
      // Step ensures (p * billVal) % 100 === 0 naturally with 0 decimals
      const step = getIntegerBaseStep(p);
      billVal = randomInt(1, 15) * step;
      ans = (p * billVal) / 100;
    } else {
      billVal = randomInt(4, 30) * 5;
      ans = roundToDecimals((p * billVal) / 100, 2);
    }

    expr = `${p}% tip on $${billVal}`;
    explanation = `Calculate ${p}% of $${billVal}: (${p} ÷ 100) × $${billVal} = $${ans}`;

  } else if (chosenScenario === 'discount') {
    const discPercents = [10, 20, 25, 30, 40, 50];
    const p = discPercents[Math.floor(Math.random() * discPercents.length)];
    let originalPrice;

    if (!allowDecimals) {
      const step = getIntegerBaseStep(p);
      originalPrice = randomInt(1, 15) * step;
      ans = (p * originalPrice) / 100;
    } else {
      originalPrice = randomInt(3, 40) * 5;
      ans = roundToDecimals((p * originalPrice) / 100, 2);
    }

    expr = `${p}% discount on $${originalPrice}`;
    explanation = `Calculate discount amount: ${p}% of $${originalPrice} = $${ans}`;

  } else if (chosenScenario === 'tax') {
    const taxPercents = [5, 10, 15, 20];
    const p = taxPercents[Math.floor(Math.random() * taxPercents.length)];
    let price;

    if (!allowDecimals) {
      const step = getIntegerBaseStep(p);
      price = randomInt(1, 15) * step;
      ans = (p * price) / 100;
    } else {
      price = randomInt(3, 40) * 5;
      ans = roundToDecimals((p * price) / 100, 2);
    }

    expr = `${p}% tax on $${price}`;
    explanation = `Calculate tax amount: ${p}% of $${price} = $${ans}`;

  } else if (chosenScenario === 'total_bill') {
    const p = 15;
    let billVal;
    if (!allowDecimals) {
      const step = getIntegerBaseStep(p);
      billVal = randomInt(1, 15) * step;
    } else {
      billVal = randomInt(2, 10) * 20;
    }
    const tipVal = (p * billVal) / 100;
    ans = roundToDecimals(billVal + tipVal, 2);
    expr = `Total bill for $${billVal} with 15% tip`;
    explanation = `Tip = 15% of $${billVal} ($${tipVal}). Total = $${billVal} + $${tipVal} = $${ans}`;

  } else {
    const p = 10;
    let itemPrice;
    if (!allowDecimals) {
      const step = getIntegerBaseStep(p);
      itemPrice = randomInt(1, 15) * step;
    } else {
      itemPrice = randomInt(2, 20) * 10;
    }
    const taxVal = (p * itemPrice) / 100;
    ans = roundToDecimals(itemPrice + taxVal, 2);
    expr = `Final price for $${itemPrice} item with 10% tax`;
    explanation = `Tax = 10% of $${itemPrice} ($${taxVal}). Final Price = $${itemPrice} + $${taxVal} = $${ans}`;
  }

  return {
    expression: expr,
    answer: ans,
    topic: 'Money',
    rawTopic: 'money',
    difficulty: difficulty,
    hint: explanation
  };
}
