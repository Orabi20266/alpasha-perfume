export const money = (value, currency = '₪') =>
  `${Number(value || 0).toLocaleString('en-US')} ${currency}`;

export const discountPercent = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

export const digitsOnly = (value = '') => String(value).replace(/\D/g, '');

export const waLink = (phone, message = '') => {
  const base = `https://wa.me/${digitsOnly(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export const makeOrderId = () =>
  `AP-${Math.floor(100000 + Math.random() * 900000)}`;

export const makeRaffleCode = () =>
  `AP-G-${Math.floor(100000 + Math.random() * 900000)}`;

export const formatDate = (iso) => {
  try {
    return new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return '';
  }
};

export const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode). The app keeps working in memory.
  }
};

export const uid = () => Math.random().toString(36).slice(2, 9);
