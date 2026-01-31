export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: 2,
  }).format(value);
};
