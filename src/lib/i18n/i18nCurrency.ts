import i18n from 'i18next';

export function formatCurrency(amount: number, currency = 'EUR') {
  const locale = i18n.language || navigator.language || 'it-IT';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

