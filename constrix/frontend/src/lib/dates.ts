export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isToday = (dateString: string): boolean => {
  const today = formatDate(new Date());
  return dateString === today;
};

export const isYesterday = (dateString: string): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === formatDate(yesterday);
};

export const daysBetween = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};