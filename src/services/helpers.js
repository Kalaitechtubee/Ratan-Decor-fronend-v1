export const currencyINR = (amount) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount || 0));
  } catch {
    return `₹${amount}`;
  }
};

export const classNames = (...classes) => classes.filter(Boolean).join(' ');


