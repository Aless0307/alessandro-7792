const currencyFormatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
const wholeCurrencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

// sin centavos, para cantidades redondas como el límite por recarga
export function formatWholeCurrency(amount: number): string {
  return wholeCurrencyFormatter.format(amount);
}
