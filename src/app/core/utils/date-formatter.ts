export const formatDate = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-ES', options).format(d);
};

export const getMonthName = (
  monthIndex: number,
  style: 'long' | 'short' | 'narrow' = 'short',
): string => {
  const date = new Date(2000, monthIndex, 1);
  return new Intl.DateTimeFormat('es-ES', { month: style }).format(date);
};
