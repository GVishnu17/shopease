export const FREE_SHIPPING_MIN = 50;
export const SHIPPING_FEE = 5;
export const TAX_RATE = 0.08;
export const COUPON_CODES = ['SAVE10', 'WELCOME5', 'FREESHIP'];

export function normalizeCoupon(code) {
  return String(code || '').trim().toUpperCase();
}

export function isValidCoupon(code) {
  return COUPON_CODES.includes(normalizeCoupon(code));
}

export function calculateTotals(subtotal, couponCode) {
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const tax = subtotal * TAX_RATE;
  const code = normalizeCoupon(couponCode);

  let discount = 0;
  if (code === 'SAVE10') discount = subtotal * 0.1;
  else if (code === 'WELCOME5') discount = subtotal * 0.05;
  else if (code === 'FREESHIP') discount = shipping;

  const total = Math.max(0, subtotal + shipping + tax - discount);
  return { subtotal, shipping, tax, discount, total };
}
