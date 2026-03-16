import { QUESTIONS_COUNT } from '../donnees/difficulty.js';

export function genererQuestions(mode, config) {
  const pool = [];

  if (mode === 'multiplication') {
    const maxB = config.maxTable || 12;
    config.tables.forEach(table => {
      for (let i = 2; i <= maxB; i++) {
        pool.push({ a: table, b: i, answer: table * i, op: '\u00d7' });
      }
    });
  } else if (mode === 'division') {
    const maxB = config.maxTable || 12;
    config.tables.forEach(table => {
      for (let i = 2; i <= maxB; i++) {
        const product = table * i;
        pool.push({ a: product, b: i, answer: table, op: '\u00f7' });
      }
    });
  } else if (mode === 'addition') {
    for (let i = 0; i < 50; i++) {
      const a = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
      const b = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
      pool.push({ a, b, answer: a + b, op: '+' });
    }
  } else if (mode === 'subtraction') {
    for (let i = 0; i < 50; i++) {
      const a = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
      const b = Math.floor(Math.random() * (a - config.min + 1)) + config.min;
      pool.push({ a, b, answer: a - b, op: '\u2212' });
    }
  } else if (mode === 'kids') {
    const addOps = config.addOperations || [1, 2, 3];
    const subOps = config.subOperations || [];
    for (let i = 0; i < 50; i++) {
      const a = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
      const allOps = [...addOps.map(n => ({type: '+', val: n})), ...subOps.map(n => ({type: '-', val: n}))];
      if (allOps.length === 0) continue;
      const op = allOps[Math.floor(Math.random() * allOps.length)];
      if (op.type === '+') {
        pool.push({ a, b: op.val, answer: a + op.val, op: '+' });
      } else {
        if (a >= op.val) {
          pool.push({ a, b: op.val, answer: a - op.val, op: '-' });
        }
      }
    }
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(QUESTIONS_COUNT, shuffled.length));
}
