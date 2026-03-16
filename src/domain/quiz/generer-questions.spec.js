import { describe, it, expect } from 'vitest';
import { genererQuestions } from './generer-questions.js';

describe('genererQuestions', () => {
  describe('multiplication', () => {
    it('generates correct answers (a * b)', () => {
      const questions = genererQuestions('multiplication', { tables: [3], maxTable: 5 });
      questions.forEach(q => {
        expect(q.answer).toBe(q.a * q.b);
        expect(q.op).toBe('\u00d7');
      });
    });

    it('returns max QUESTIONS_COUNT questions', () => {
      const questions = genererQuestions('multiplication', { tables: [2, 3, 4, 5, 6, 7, 8, 9], maxTable: 12 });
      expect(questions.length).toBe(10);
    });
  });

  describe('division', () => {
    it('generates correct answers', () => {
      const questions = genererQuestions('division', { tables: [4], maxTable: 6 });
      questions.forEach(q => {
        expect(q.answer).toBe(q.a / q.b);
        expect(q.op).toBe('\u00f7');
      });
    });
  });

  describe('addition', () => {
    it('generates questions in range', () => {
      const questions = genererQuestions('addition', { min: 1, max: 20 });
      questions.forEach(q => {
        expect(q.a).toBeGreaterThanOrEqual(1);
        expect(q.a).toBeLessThanOrEqual(20);
        expect(q.b).toBeGreaterThanOrEqual(1);
        expect(q.b).toBeLessThanOrEqual(20);
        expect(q.answer).toBe(q.a + q.b);
        expect(q.op).toBe('+');
      });
    });
  });

  describe('subtraction', () => {
    it('generates non-negative answers', () => {
      const questions = genererQuestions('subtraction', { min: 1, max: 20 });
      questions.forEach(q => {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBe(q.a - q.b);
        expect(q.op).toBe('\u2212');
      });
    });
  });

  describe('kids', () => {
    it('respects addOperations', () => {
      const questions = genererQuestions('kids', { min: 1, max: 10, addOperations: [1, 2], subOperations: [] });
      questions.forEach(q => {
        expect(q.op).toBe('+');
        expect([1, 2]).toContain(q.b);
        expect(q.answer).toBe(q.a + q.b);
      });
    });

    it('respects subOperations', () => {
      const questions = genererQuestions('kids', { min: 5, max: 10, addOperations: [], subOperations: [1, 2] });
      questions.forEach(q => {
        expect(q.op).toBe('-');
        expect([1, 2]).toContain(q.b);
        expect(q.answer).toBe(q.a - q.b);
        expect(q.answer).toBeGreaterThanOrEqual(0);
      });
    });
  });

  it('returns max QUESTIONS_COUNT questions', () => {
    const questions = genererQuestions('multiplication', { tables: [2, 3, 4, 5, 6, 7, 8, 9], maxTable: 12 });
    expect(questions.length).toBeLessThanOrEqual(10);
  });

  it('returns empty array for empty config', () => {
    const questions = genererQuestions('multiplication', { tables: [], maxTable: 12 });
    expect(questions).toEqual([]);
  });
});
