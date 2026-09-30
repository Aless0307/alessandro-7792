import { z } from 'zod';

// Contrato de SnailPay, la pasarela de pagos simulada. Lo usan el backend (para validar)
// y el frontend (para validar el formulario y tipar la respuesta).

export const SNAILPAY_MAX_AMOUNT = 10_000;

export const cardNumberSchema = z
  .string()
  .transform((value) => value.replace(/\s+/g, ''))
  .pipe(z.string().regex(/^\d{16}$/, 'El número de tarjeta debe tener 16 dígitos.'));

export const expirationDateSchema = z
  .string()
  .trim()
  .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'La fecha de vencimiento debe tener el formato MM/AA.');

export const cvvSchema = z
  .string()
  .trim()
  .regex(/^\d{3}$/, 'El CVV debe tener 3 dígitos.');

export const cardholderNameSchema = z
  .string()
  .trim()
  .min(1, 'Escribe el nombre como aparece en la tarjeta.')
  .max(80, 'Usa como máximo 80 caracteres.');

// El monto llega en pesos, con 2 decimales como máximo. El límite por recarga es una regla
// de negocio (se rechaza con su propio motivo), no un error de formato.
export const amountSchema = z
  .number({ error: 'El monto debe ser un número.' })
  .positive('El monto debe ser mayor que cero.')
  .refine(hasAtMostTwoDecimals, 'El monto admite como máximo 2 decimales.');

// Tolerancia para errores de punto flotante: 10.1 * 100 = 1009.9999999999999.
function hasAtMostTwoDecimals(value: number): boolean {
  const cents = value * 100;
  return Math.abs(cents - Math.round(cents)) < 1e-6;
}

export const chargeRequestSchema = z.object({
  card_number: cardNumberSchema,
  expiration_date: expirationDateSchema,
  cvv: cvvSchema,
  cardholder_name: cardholderNameSchema,
  amount: amountSchema,
  payer_id: z.string().trim().min(1, 'Falta el identificador del usuario.'),
  payer_email: z.string().trim().pipe(z.email('El correo del usuario no es válido.')),
});

export type ChargeRequest = z.input<typeof chargeRequestSchema>;
export type ValidChargeRequest = z.output<typeof chargeRequestSchema>;

export type ChargeStatus = 'approved' | 'rejected' | 'error';

export type ChargeStatusDetail =
  | 'accredited'
  | 'invalid_data'
  | 'invalid_card_data'
  | 'card_declined'
  | 'insufficient_funds'
  | 'expired_card'
  | 'amount_limit_exceeded'
  | 'unknown_card'
  | 'service_unavailable'
  | 'gateway_timeout';

export interface FieldError {
  field: string;
  message: string;
}

export interface ChargeResponse {
  id: string;
  status: ChargeStatus;
  status_detail: ChargeStatusDetail;
  // Texto listo para mostrar al usuario.
  message: string;
  transaction_amount: number | null;
  date_created: string;
  authorization_code: string | null;
  reference: string;
  payer_id: string | null;
  payer_email: string | null;
  // El enunciado pide devolverlos; siempre son datos ficticios de prueba.
  card_number: string | null;
  cvv: string | null;
  // Solo cuando status_detail es 'invalid_data'.
  errors?: FieldError[];
}
