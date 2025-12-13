// src/utils/index.js
// Add slugify function
export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const currencyINR = (amount) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount || 0));
  } catch {
    return `₹${amount}`;
  }
};

export const classNames = (...classes) => classes.filter(Boolean).join(' ');