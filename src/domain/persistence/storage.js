const STORAGE_KEY = 'mathquiz_stats';
const PUZZLE_KEY = 'mathquiz_puzzles';

const defaultStats = {
  totalScore: 0, gamesPlayed: 0, perfectGames: 0, bestStreak: 0,
  totalCorrect: 0, totalQuestions: 0, expertPerfects: 0, fastAnswers: 0,
  achievements: [],
};

export function chargerStats(storage = localStorage) {
  try {
    const saved = storage.getItem(STORAGE_KEY);
    return saved ? { ...defaultStats, ...JSON.parse(saved) } : { ...defaultStats };
  } catch { return { ...defaultStats }; }
}

export function sauvegarderStats(stats, storage = localStorage) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(stats)); } catch {}
}

export function chargerPuzzles(storage = localStorage) {
  try {
    const saved = storage.getItem(PUZZLE_KEY);
    if (!saved) return creerDefaut();
    const parsed = JSON.parse(saved);
    const def = creerDefaut();
    const mergedPuzzles = def.puzzles.map((d, idx) =>
      parsed.puzzles && parsed.puzzles[idx] ? { ...d, ...parsed.puzzles[idx] } : d
    );
    return { ...def, ...parsed, puzzles: mergedPuzzles };
  } catch { return creerDefaut(); }
}

export function sauvegarderPuzzles(puzzles, storage = localStorage) {
  try { storage.setItem(PUZZLE_KEY, JSON.stringify(puzzles)); } catch {}
}

function creerDefaut() {
  return {
    currentPuzzle: 0,
    puzzles: Array.from({ length: 10 }, (_, id) => ({
      id, pieces: Array(9).fill(false), completed: false, lives: 0,
    })),
  };
}

export function statsParDefaut() { return { ...defaultStats }; }
