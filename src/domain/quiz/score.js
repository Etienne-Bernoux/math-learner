export function calculerScore(correctCount, difficulty) {
  const multipliers = { zen: 0.5, easy: 1, normal: 1.5, expert: 2 };
  return Math.round(correctCount * (multipliers[difficulty] || 1) * 10);
}

export function getMessage(percent) {
  if (percent === 100) return { emoji: '\uD83C\uDFC6', text: 'Parfait !' };
  if (percent >= 80) return { emoji: '\uD83D\uDD25', text: 'Excellent !' };
  if (percent >= 60) return { emoji: '\uD83D\uDCAA', text: 'Pas mal !' };
  if (percent >= 40) return { emoji: '\uD83D\uDCDA', text: 'Continue !' };
  return { emoji: '\uD83C\uDFAF', text: '\u00c0 retravailler' };
}

export function getKidsMessage(percent) {
  if (percent === 100) return { emoji: '\uD83C\uDFC6', text: 'PARFAIT !', color: 'text-yellow-500' };
  if (percent >= 80) return { emoji: '\uD83C\uDF1F', text: 'Super travail !', color: 'text-green-500' };
  if (percent >= 60) return { emoji: '\uD83D\uDC4D', text: 'Bien jou\u00e9 !', color: 'text-blue-500' };
  if (percent >= 40) return { emoji: '\uD83D\uDCAA', text: 'Continue !', color: 'text-purple-500' };
  return { emoji: '\uD83C\uDF08', text: 'Tu vas y arriver !', color: 'text-pink-500' };
}
