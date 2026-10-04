import type { ChargeResponse } from '@snail/shared';
import { STORAGE_KEYS, readJson, writeJson } from '../../../lib/storage/localStore';

// Se guarda la respuesta completa, tarjeta y CVV incluidos (siempre datos de prueba).

export function getCharges(): ChargeResponse[] {
  const charges = readJson<ChargeResponse[]>(STORAGE_KEYS.charges);
  return Array.isArray(charges) ? charges : [];
}

export function getChargesFor(payerId: string): ChargeResponse[] {
  return getCharges().filter((charge) => charge.payer_id === payerId);
}

// false si ya existía, para no acreditar dos veces
export function recordCharge(charge: ChargeResponse): boolean {
  const charges = getCharges();
  if (charges.some((existing) => existing.id === charge.id)) return false;
  writeJson(STORAGE_KEYS.charges, [...charges, charge]);
  return true;
}
