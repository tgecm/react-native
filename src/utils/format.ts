export const formatCurrency = (amount: number): string => {
  return `${Number(amount).toLocaleString()} MMK`;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const formatPercent = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
};
