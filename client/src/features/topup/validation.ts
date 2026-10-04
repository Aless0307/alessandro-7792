import {
  amountSchema,
  cardNumberSchema,
  cardholderNameSchema,
  cvvSchema,
  expirationDateSchema,
} from '@snail/shared';
import { z } from 'zod';

export const topUpFormSchema = z.object({
  card_number: cardNumberSchema,
  expiration_date: expirationDateSchema,
  cvv: cvvSchema,
  cardholder_name: cardholderNameSchema,
  amount: z
    .string()
    .trim()
    .min(1, 'Escribe el monto a recargar.')
    .transform((value) => Number(value.replace(/,/g, '')))
    .pipe(amountSchema),
});

export type TopUpFormValues = z.input<typeof topUpFormSchema>;
export type TopUpFormData = z.output<typeof topUpFormSchema>;

export const EMPTY_TOP_UP_FORM: TopUpFormValues = {
  card_number: '',
  expiration_date: '',
  cvv: '',
  cardholder_name: '',
  amount: '',
};
