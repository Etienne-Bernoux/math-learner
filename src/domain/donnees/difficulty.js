export const QUESTIONS_COUNT = 10;

export const DIFFICULTY = Object.freeze({
  zen:    { label: 'Zen',     timer: 0,  multiplier: 0.5, color: 'from-sky-400 to-blue-500' },
  easy:   { label: 'Facile',  timer: 12, multiplier: 1,   color: 'from-green-500 to-emerald-500' },
  normal: { label: 'Normal',  timer: 8,  multiplier: 1.5, color: 'from-yellow-500 to-orange-500' },
  expert: { label: 'Expert',  timer: 4,  multiplier: 2,   color: 'from-red-500 to-pink-500' },
});

export const MODES = Object.freeze({
  multiplication: { label: 'Multiplication', symbol: '\u00d7', icon: '\u2715', color: 'from-violet-500 to-purple-400' },
  division:       { label: 'Division',       symbol: '\u00f7', icon: '\u00f7', color: 'from-rose-400 to-pink-500' },
  addition:       { label: 'Addition',       symbol: '+', icon: '+', color: 'from-emerald-400 to-teal-500' },
  subtraction:    { label: 'Soustraction',   symbol: '\u2212', icon: '\u2212', color: 'from-amber-400 to-orange-500' },
});
