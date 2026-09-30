import type { ChargeResponse } from '@snail/shared';
import { STORAGE_KEYS, readJson, writeJson } from '../../../lib/storage/localStore';

// Historial de operaciones con SnailPay en localStorage. Guarda la respuesta completa,
// incluidos número de tarjeta y CVV, porque así lo pide el enunciado (siempre ficticios).

export function getCharges(): ChargeResponse[] {
  const charges = readJson<ChargeResponse[]>(STORAGE_KEYS.charges);
  return Array.isArray(charges) ? charges : [];
}

export function getChargesFor(payerId: string): ChargeResponse[] {
  return getCharges().filter((charge) => charge.payer_id === payerId);
}

// Devuelve false si la operación ya estaba registrada (misma id): así no se procesa dos veces.
export function recordCharge(charge: ChargeResponse): boolean {
  const charges = getCharges();
  if (charges.some((existing) => existing.id === charge.id)) return false;
  writeJson(STORAGE_KEYS.charges, [...charges, charge]);
  return true;
}
