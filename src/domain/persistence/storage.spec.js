import { describe, it, expect } from 'vitest';
import { chargerStats, sauvegarderStats, chargerPuzzles, sauvegarderPuzzles, statsParDefaut } from './storage.js';

function createMockStorage(data = {}) {
  const store = { ...data };
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = value; },
    _store: store,
  };
}

describe('chargerStats', () => {
  it('returns defaults when empty', () => {
    const storage = createMockStorage();
    const stats = chargerStats(storage);
    expect(stats.totalScore).toBe(0);
    expect(stats.gamesPlayed).toBe(0);
    expect(stats.achievements).toEqual([]);
  });

  it('loads saved data', () => {
    const saved = { totalScore: 500, gamesPlayed: 10, achievements: ['first_game'] };
    const storage = createMockStorage({ mathquiz_stats: JSON.stringify(saved) });
    const stats = chargerStats(storage);
    expect(stats.totalScore).toBe(500);
    expect(stats.gamesPlayed).toBe(10);
    expect(stats.achievements).toEqual(['first_game']);
  });

  it('merges saved data with defaults for missing fields', () => {
    const saved = { totalScore: 100 };
    const storage = createMockStorage({ mathquiz_stats: JSON.stringify(saved) });
    const stats = chargerStats(storage);
    expect(stats.totalScore).toBe(100);
    expect(stats.gamesPlayed).toBe(0);
    expect(stats.achievements).toEqual([]);
  });

  it('returns defaults on corrupted data', () => {
    const storage = createMockStorage({ mathquiz_stats: 'not-json' });
    const stats = chargerStats(storage);
    expect(stats.totalScore).toBe(0);
  });
});

describe('sauvegarderStats', () => {
  it('persists stats', () => {
    const storage = createMockStorage();
    const stats = { ...statsParDefaut(), totalScore: 200 };
    sauvegarderStats(stats, storage);
    expect(JSON.parse(storage._store.mathquiz_stats).totalScore).toBe(200);
  });
});

describe('chargerPuzzles', () => {
  it('returns 10 puzzles when empty', () => {
    const storage = createMockStorage();
    const puzzles = chargerPuzzles(storage);
    expect(puzzles.puzzles).toHaveLength(10);
    expect(puzzles.currentPuzzle).toBe(0);
    puzzles.puzzles.forEach((p, i) => {
      expect(p.id).toBe(i);
      expect(p.pieces).toHaveLength(9);
      expect(p.completed).toBe(false);
    });
  });

  it('merges existing data', () => {
    const saved = {
      currentPuzzle: 2,
      puzzles: Array.from({ length: 10 }, (_, id) => ({
        id, pieces: id === 0 ? Array(9).fill(true) : Array(9).fill(false),
        completed: id === 0, lives: id === 0 ? 5 : 0,
      })),
    };
    const storage = createMockStorage({ mathquiz_puzzles: JSON.stringify(saved) });
    const puzzles = chargerPuzzles(storage);
    expect(puzzles.currentPuzzle).toBe(2);
    expect(puzzles.puzzles[0].completed).toBe(true);
    expect(puzzles.puzzles[0].lives).toBe(5);
    expect(puzzles.puzzles[1].completed).toBe(false);
  });

  it('returns defaults on corrupted data', () => {
    const storage = createMockStorage({ mathquiz_puzzles: '{bad' });
    const puzzles = chargerPuzzles(storage);
    expect(puzzles.puzzles).toHaveLength(10);
  });
});

describe('sauvegarderPuzzles', () => {
  it('persists puzzles', () => {
    const storage = createMockStorage();
    const data = { currentPuzzle: 3, puzzles: [] };
    sauvegarderPuzzles(data, storage);
    expect(JSON.parse(storage._store.mathquiz_puzzles).currentPuzzle).toBe(3);
  });
});
