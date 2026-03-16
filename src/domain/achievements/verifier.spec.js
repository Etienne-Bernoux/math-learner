import { describe, it, expect } from 'vitest';
import { verifierAchievements } from './verifier.js';

function makeStats(overrides = {}) {
  return {
    totalScore: 0, gamesPlayed: 0, perfectGames: 0, bestStreak: 0,
    totalCorrect: 0, totalQuestions: 0, expertPerfects: 0, fastAnswers: 0,
    achievements: [],
    ...overrides,
  };
}

function makeGameData(overrides = {}) {
  return {
    results: Array(10).fill({ correct: true }),
    difficulty: 'normal',
    currentStreak: 0,
    ...overrides,
  };
}

describe('verifierAchievements', () => {
  it('unlocks first_game on first game', () => {
    const result = verifierAchievements(makeStats(), makeGameData());
    expect(result).toContain('first_game');
  });

  it('unlocks perfect when all answers correct', () => {
    const result = verifierAchievements(makeStats(), makeGameData());
    expect(result).toContain('perfect');
  });

  it('does not unlock perfect when some answers wrong', () => {
    const results = [...Array(8).fill({ correct: true }), { correct: false }, { correct: true }];
    const result = verifierAchievements(makeStats(), makeGameData({ results }));
    expect(result).not.toContain('perfect');
  });

  it('unlocks speed_demon when expert + perfect', () => {
    const result = verifierAchievements(makeStats(), makeGameData({ difficulty: 'expert' }));
    expect(result).toContain('speed_demon');
  });

  it('does not unlock speed_demon on normal difficulty', () => {
    const result = verifierAchievements(makeStats(), makeGameData({ difficulty: 'normal' }));
    expect(result).not.toContain('speed_demon');
  });

  it('unlocks streak_5 at threshold', () => {
    const result = verifierAchievements(makeStats(), makeGameData({ currentStreak: 5 }));
    expect(result).toContain('streak_5');
  });

  it('does not unlock streak_5 below threshold', () => {
    const result = verifierAchievements(makeStats(), makeGameData({ currentStreak: 4 }));
    expect(result).not.toContain('streak_5');
  });

  it('unlocks streak_10 at threshold', () => {
    const result = verifierAchievements(makeStats(), makeGameData({ currentStreak: 10 }));
    expect(result).toContain('streak_10');
  });

  it('unlocks veteran at 10 games', () => {
    const result = verifierAchievements(makeStats({ gamesPlayed: 9 }), makeGameData());
    expect(result).toContain('veteran');
  });

  it('does not unlock veteran before 10 games', () => {
    const result = verifierAchievements(makeStats({ gamesPlayed: 8 }), makeGameData());
    expect(result).not.toContain('veteran');
  });

  it('unlocks master at 50 games', () => {
    const result = verifierAchievements(makeStats({ gamesPlayed: 49 }), makeGameData());
    expect(result).toContain('master');
  });

  it('unlocks perfectionist at 5 perfect games', () => {
    const result = verifierAchievements(makeStats({ perfectGames: 4 }), makeGameData());
    expect(result).toContain('perfectionist');
  });

  it('unlocks scholar at 500 correct answers', () => {
    const result = verifierAchievements(makeStats({ totalCorrect: 492 }), makeGameData());
    expect(result).toContain('scholar');
  });

  it('unlocks lightning at 10 fast answers', () => {
    const result = verifierAchievements(makeStats({ fastAnswers: 10 }), makeGameData());
    expect(result).toContain('lightning');
  });

  it('does not duplicate already earned achievements', () => {
    const stats = makeStats({ achievements: ['first_game', 'perfect', 'speed_demon'] });
    const result = verifierAchievements(stats, makeGameData({ difficulty: 'expert' }));
    expect(result).not.toContain('first_game');
    expect(result).not.toContain('perfect');
    expect(result).not.toContain('speed_demon');
  });
});
