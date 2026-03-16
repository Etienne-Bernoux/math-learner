import { describe, it, expect } from 'vitest';
import { calculerScore, getMessage, getKidsMessage } from './score.js';

describe('calculerScore', () => {
  it('applies zen multiplier (0.5)', () => {
    expect(calculerScore(10, 'zen')).toBe(50);
  });

  it('applies easy multiplier (1)', () => {
    expect(calculerScore(10, 'easy')).toBe(100);
  });

  it('applies normal multiplier (1.5)', () => {
    expect(calculerScore(10, 'normal')).toBe(150);
  });

  it('applies expert multiplier (2)', () => {
    expect(calculerScore(10, 'expert')).toBe(200);
  });

  it('defaults to multiplier 1 for unknown difficulty', () => {
    expect(calculerScore(5, 'unknown')).toBe(50);
  });

  it('handles 0 correct answers', () => {
    expect(calculerScore(0, 'expert')).toBe(0);
  });
});

describe('getMessage', () => {
  it('returns Parfait for 100%', () => {
    expect(getMessage(100).text).toBe('Parfait !');
  });

  it('returns Excellent for 80-99%', () => {
    expect(getMessage(80).text).toBe('Excellent !');
    expect(getMessage(99).text).toBe('Excellent !');
  });

  it('returns Pas mal for 60-79%', () => {
    expect(getMessage(60).text).toBe('Pas mal !');
    expect(getMessage(79).text).toBe('Pas mal !');
  });

  it('returns Continue for 40-59%', () => {
    expect(getMessage(40).text).toBe('Continue !');
    expect(getMessage(59).text).toBe('Continue !');
  });

  it('returns A retravailler for < 40%', () => {
    expect(getMessage(39).text).toBe('\u00c0 retravailler');
    expect(getMessage(0).text).toBe('\u00c0 retravailler');
  });
});

describe('getKidsMessage', () => {
  it('returns PARFAIT for 100%', () => {
    const msg = getKidsMessage(100);
    expect(msg.text).toBe('PARFAIT !');
    expect(msg.color).toBe('text-yellow-500');
  });

  it('returns Super travail for 80-99%', () => {
    expect(getKidsMessage(85).text).toBe('Super travail !');
    expect(getKidsMessage(85).color).toBe('text-green-500');
  });

  it('returns Bien joue for 60-79%', () => {
    expect(getKidsMessage(65).text).toBe('Bien jou\u00e9 !');
    expect(getKidsMessage(65).color).toBe('text-blue-500');
  });

  it('returns Continue for 40-59%', () => {
    expect(getKidsMessage(45).text).toBe('Continue !');
    expect(getKidsMessage(45).color).toBe('text-purple-500');
  });

  it('returns Tu vas y arriver for < 40%', () => {
    expect(getKidsMessage(20).text).toBe('Tu vas y arriver !');
    expect(getKidsMessage(20).color).toBe('text-pink-500');
  });
});
