// "1234123412341234" → "1234 1234 1234 1234"
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

// "1226" → "12/26"
export function formatExpirationDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function formatCvv(value: string): string {
  return value.replace(/\D/g, '').slice(0, 3);
}

// solo dígitos y hasta 2 decimales
export function formatAmount(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '');
  const [integer = '', ...rest] = cleaned.split('.');
  if (rest.length === 0) return integer.slice(0, 7);
  return `${integer.slice(0, 7)}.${rest.join('').slice(0, 2)}`;
}

// "1234123412341234" → "•••• 1234"
export function maskCardNumber(cardNumber: string): string {
  return `•••• ${cardNumber.replace(/\s/g, '').slice(-4)}`;
}
