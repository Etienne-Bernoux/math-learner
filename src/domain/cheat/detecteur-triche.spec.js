import { describe, it, expect, vi } from 'vitest';
import { creerDetecteurTripleDollar } from './detecteur-triche.js';

describe('creerDetecteurTripleDollar', () => {
  it('fires callback after 3 $ within delay', () => {
    const callback = vi.fn();
    const onKey = creerDetecteurTripleDollar(callback, 2000);
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1500)
      .mockReturnValueOnce(1800);

    onKey('$');
    onKey('$');
    const result = onKey('$');

    expect(callback).toHaveBeenCalledOnce();
    expect(result).toBe(true);

    vi.restoreAllMocks();
  });

  it('does not fire with other keys', () => {
    const callback = vi.fn();
    const onKey = creerDetecteurTripleDollar(callback, 2000);

    expect(onKey('a')).toBe(false);
    expect(onKey('b')).toBe(false);
    expect(onKey('c')).toBe(false);
    expect(callback).not.toHaveBeenCalled();
  });

  it('does not fire if too slow', () => {
    const callback = vi.fn();
    const onKey = creerDetecteurTripleDollar(callback, 2000);
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(2000)
      .mockReturnValueOnce(3500);

    onKey('$');
    onKey('$');
    const result = onKey('$');

    expect(callback).not.toHaveBeenCalled();
    expect(result).toBe(false);

    vi.restoreAllMocks();
  });

  it('resets after triggering', () => {
    const callback = vi.fn();
    const onKey = creerDetecteurTripleDollar(callback, 2000);
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1500)
      .mockReturnValueOnce(1800)
      .mockReturnValueOnce(2000);

    onKey('$');
    onKey('$');
    onKey('$');
    expect(callback).toHaveBeenCalledOnce();

    // After reset, a single $ should not trigger
    const result = onKey('$');
    expect(result).toBe(false);
    expect(callback).toHaveBeenCalledOnce();

    vi.restoreAllMocks();
  });
});
