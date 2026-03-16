import { describe, it, expect } from 'vitest';
import { creerPuzzlesDefaut, attribuerPieces } from './progression.js';

describe('creerPuzzlesDefaut', () => {
  it('creates 10 puzzles with 9 pieces each', () => {
    const data = creerPuzzlesDefaut();
    expect(data.puzzles).toHaveLength(10);
    data.puzzles.forEach((puzzle, idx) => {
      expect(puzzle.id).toBe(idx);
      expect(puzzle.pieces).toHaveLength(9);
      expect(puzzle.pieces.every(p => p === false)).toBe(true);
      expect(puzzle.completed).toBe(false);
      expect(puzzle.lives).toBe(0);
    });
  });

  it('starts at puzzle 0', () => {
    expect(creerPuzzlesDefaut().currentPuzzle).toBe(0);
  });
});

describe('attribuerPieces', () => {
  it('gives 0 pieces below 70%', () => {
    const data = creerPuzzlesDefaut();
    const result = attribuerPieces(data, 69);
    expect(result.piecesEarned).toBe(0);
    expect(result.pieceIndices).toEqual([]);
    expect(result.justCompleted).toBe(false);
  });

  it('gives 1 piece at 70-99%', () => {
    const data = creerPuzzlesDefaut();
    const result = attribuerPieces(data, 80);
    expect(result.piecesEarned).toBe(1);
    expect(result.pieceIndices).toHaveLength(1);
    expect(result.puzzleData.puzzles[0].pieces[0]).toBe(true);
  });

  it('gives 2 pieces at 100%', () => {
    const data = creerPuzzlesDefaut();
    const result = attribuerPieces(data, 100);
    expect(result.piecesEarned).toBe(2);
    expect(result.pieceIndices).toHaveLength(2);
    expect(result.puzzleData.puzzles[0].pieces[0]).toBe(true);
    expect(result.puzzleData.puzzles[0].pieces[1]).toBe(true);
  });

  it('completes puzzle when all 9 pieces earned and grants 5 lives', () => {
    const data = creerPuzzlesDefaut();
    // Set 8 pieces already earned
    for (let i = 0; i < 8; i++) {
      data.puzzles[0].pieces[i] = true;
    }
    const result = attribuerPieces(data, 80);
    expect(result.justCompleted).toBe(true);
    expect(result.puzzleData.puzzles[0].completed).toBe(true);
    expect(result.puzzleData.puzzles[0].lives).toBe(5);
  });

  it('advances to next incomplete puzzle on completion', () => {
    const data = creerPuzzlesDefaut();
    // Set all 9 pieces minus one
    for (let i = 0; i < 8; i++) {
      data.puzzles[0].pieces[i] = true;
    }
    const result = attribuerPieces(data, 80);
    expect(result.justCompleted).toBe(true);
    expect(result.puzzleData.currentPuzzle).toBe(1);
  });

  it('does not mutate original data', () => {
    const data = creerPuzzlesDefaut();
    attribuerPieces(data, 100);
    expect(data.puzzles[0].pieces.every(p => p === false)).toBe(true);
  });

  it('returns 0 pieces when current puzzle is already complete', () => {
    const data = creerPuzzlesDefaut();
    data.puzzles[0].pieces = Array(9).fill(true);
    data.puzzles[0].completed = true;
    const result = attribuerPieces(data, 100);
    expect(result.piecesEarned).toBe(0);
  });
});
