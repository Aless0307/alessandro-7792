import { describe, expect, it } from 'vitest';
import {
  formatAmount,
  formatCardNumber,
  formatCvv,
  formatExpirationDate,
  maskCardNumber,
} from './cardFormat';

describe('formateadores de la tarjeta', () => {
  it('agrupa el número de tarjeta de 4 en 4 y descarta lo que no es dígito', () => {
    expect(formatCardNumber('1234-1234 1234abc12345678')).toBe('1234 1234 1234 1234');
  });

  it('agrega la diagonal a la fecha de vencimiento', () => {
    expect(formatExpirationDate('1')).toBe('1');
    expect(formatExpirationDate('12')).toBe('12');
    expect(formatExpirationDate('122')).toBe('12/2');
    expect(formatExpirationDate('12/26')).toBe('12/26');
  });

  it('limita el CVV a 3 dígitos', () => {
    expect(formatCvv('54a39')).toBe('543');
  });

  it('acepta montos con hasta 2 decimales', () => {
    expect(formatAmount('250.555')).toBe('250.55');
    expect(formatAmount('1,000')).toBe('1000');
    expect(formatAmount('12.3.4')).toBe('12.34');
  });

  it('nunca muestra el número completo al enmascarar', () => {
    expect(maskCardNumber('1234 1234 1234 5678')).toBe('•••• 5678');
  });
});
