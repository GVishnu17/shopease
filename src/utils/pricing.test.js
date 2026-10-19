import { calculateTotals, isValidCoupon, normalizeCoupon } from './pricing';

describe('normalizeCoupon', () => {
  test('trims spaces and uses capital letters', () => {
    expect(normalizeCoupon('  save10 ')).toBe('SAVE10');
  });

  test('handles empty values', () => {
    expect(normalizeCoupon('')).toBe('');
    expect(normalizeCoupon(undefined)).toBe('');
  });
});

describe('isValidCoupon', () => {
  test('accepts the three real codes in any case', () => {
    expect(isValidCoupon('SAVE10')).toBe(true);
    expect(isValidCoupon('welcome5')).toBe(true);
    expect(isValidCoupon(' freeship ')).toBe(true);
  });

  test('rejects unknown or empty codes', () => {
    expect(isValidCoupon('HELLO')).toBe(false);
    expect(isValidCoupon('')).toBe(false);
  });
});

describe('calculateTotals', () => {
  test('charges the shipping fee below the free shipping limit', () => {
    expect(calculateTotals(40, '').shipping).toBe(5);
  });

  test('shipping is free at exactly 50', () => {
    expect(calculateTotals(50, '').shipping).toBe(0);
  });

  test('tax is 8 percent of the subtotal', () => {
    expect(calculateTotals(100, '').tax).toBeCloseTo(8);
  });

  test('total adds subtotal, shipping and tax', () => {
    expect(calculateTotals(100, '').total).toBeCloseTo(108);
    expect(calculateTotals(40, '').total).toBeCloseTo(48.2);
  });

  test('SAVE10 takes 10 percent off the subtotal', () => {
    const result = calculateTotals(100, 'SAVE10');
    expect(result.discount).toBeCloseTo(10);
    expect(result.total).toBeCloseTo(98);
  });

  test('WELCOME5 takes 5 percent off the subtotal', () => {
    const result = calculateTotals(100, 'WELCOME5');
    expect(result.discount).toBeCloseTo(5);
    expect(result.total).toBeCloseTo(103);
  });

  test('FREESHIP removes the shipping fee', () => {
    const result = calculateTotals(40, 'FREESHIP');
    expect(result.discount).toBe(5);
    expect(result.total).toBeCloseTo(43.2);
  });

  test('FREESHIP gives nothing extra when shipping is already free', () => {
    expect(calculateTotals(100, 'FREESHIP').discount).toBe(0);
  });

  test('an unknown coupon changes nothing', () => {
    expect(calculateTotals(100, 'HELLO').discount).toBe(0);
  });

  test('coupon codes work in lowercase', () => {
    expect(calculateTotals(100, 'save10').discount).toBeCloseTo(10);
  });

  test('the total never goes below zero', () => {
    expect(calculateTotals(0, 'FREESHIP').total).toBe(0);
  });
});
