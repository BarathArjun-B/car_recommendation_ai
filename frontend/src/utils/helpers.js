export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

export const formatLakhs = (priceInLakhs) => `₹ ${Number(priceInLakhs).toFixed(1)} Lakh`;

export const formatKm = (km) => `${Number(km).toLocaleString('en-IN')} km`;

export const normalizeText = (value) => String(value || '').trim().toLowerCase();

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'BM';

export const calculateEmi = (principal, annualRate, months) => {
  const rate = annualRate / 12 / 100;
  if (!rate) return Math.round(principal / months);
  return Math.round((principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1));
};
