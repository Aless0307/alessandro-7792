import { z } from 'zod';

// Contrato de SnailPay, compartido por front y back.

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

export const chargeStatusSchema = z.enum(['approved', 'rejected', 'error']);

export const chargeStatusDetailSchema = z.enum([
  'accredited',
  'invalid_data',
  'invalid_card_data',
  'card_declined',
  'insufficient_funds',
  'expired_card',
  'unknown_card',
  'service_unavailable',
  'gateway_timeout',
]);

export const fieldErrorSchema = z.object({ field: z.string(), message: z.string() });

// El front valida cada respuesta con esto antes de usarla.
export const chargeResponseSchema = z.object({
  id: z.string(),
  status: chargeStatusSchema,
  status_detail: chargeStatusDetailSchema,
  message: z.string(),
  transaction_amount: z.number().nullable(),
  date_created: z.string(),
  authorization_code: z.string().nullable(),
  reference: z.string(),
  payer_id: z.string().nullable(),
  payer_email: z.string().nullable(),
  // se devuelven a propósito; siempre son datos de prueba
  card_number: z.string().nullable(),
  cvv: z.string().nullable(),
  // Solo cuando status_detail es 'invalid_data'.
  errors: z.array(fieldErrorSchema).optional(),
});

export type ChargeStatus = z.infer<typeof chargeStatusSchema>;
export type ChargeStatusDetail = z.infer<typeof chargeStatusDetailSchema>;
export type FieldError = z.infer<typeof fieldErrorSchema>;
export type ChargeResponse = z.infer<typeof chargeResponseSchema>;
