import { describe, it, expect } from 'vitest';
import { cn, formatNumber, formatCurrency, formatPercentage, debounce, throttle } from './src/shared/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('joins truthy class names', () => {
      expect(cn('a', 'b', true, false, undefined, null)).toBe('a b true');
    });
  });

  describe('formatNumber', () => {
    it('formats thousands', () => {
      expect(formatNumber(1500)).toBe('1.5K');
    });
    it('formats millions', () => {
      expect(formatNumber(1500000)).toBe('1.5M');
    });
    it('returns plain number for small values', () => {
      expect(formatNumber(500)).toBe('500');
    });
  });

  describe('formatCurrency', () => {
    it('formats as USD', () => {
      expect(formatCurrency(1500)).toBe('$1,500');
    });
  });

  describe('formatPercentage', () => {
    it('adds sign for positive', () => {
      expect(formatPercentage(12.5)).toBe('+12.5%');
    });
    it('keeps sign for negative', () => {
      expect(formatPercentage(-8.3)).toBe('-8.3%');
    });
  });

  describe('debounce', () => {
    it('delays function execution', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced();
      debounced();
      expect(fn).not.toHaveBeenCalled();
      await new Promise((r) => setTimeout(r, 150));
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('limits function execution', async () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);
      throttled();
      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
      await new Promise((r) => setTimeout(r, 150));
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
