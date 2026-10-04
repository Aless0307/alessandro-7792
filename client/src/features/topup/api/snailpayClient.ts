import { chargeResponseSchema, type ChargeRequest, type ChargeResponse } from '@snail/shared';
import { SNAILPAY_TIMEOUT_MS } from '../../../config/env';
import { NetworkError, RequestTimeoutError, postJson } from '../../../lib/api/httpClient';

export type ChargeOutcome =
  | { kind: 'approved'; response: ChargeResponse }
  | { kind: 'rejected'; response: ChargeResponse }
  | { kind: 'system_error'; response: ChargeResponse }
  | { kind: 'timeout' }
  | { kind: 'network_error' }
  | { kind: 'unexpected' };

const APPROVED_HTTP_STATUS = 201;

export async function requestCharge(
  request: ChargeRequest,
  timeoutMs: number = SNAILPAY_TIMEOUT_MS,
): Promise<ChargeOutcome> {
  let status: number;
  let data: unknown;
  try {
    ({ status, data } = await postJson('/api/snailpay/charges', request, { timeoutMs }));
  } catch (error) {
    if (error instanceof RequestTimeoutError) return { kind: 'timeout' };
    if (error instanceof NetworkError) return { kind: 'network_error' };
    return { kind: 'unexpected' };
  }

  // si no cumple el contrato, no se usa
  const parsed = chargeResponseSchema.safeParse(data);
  if (!parsed.success) return { kind: 'unexpected' };
  const response = parsed.data;

  if (response.status === 'approved') {
    // un aprobado tiene que cuadrar en todo, si no se descarta
    const isConsistent =
      status === APPROVED_HTTP_STATUS &&
      response.authorization_code !== null &&
      response.transaction_amount === request.amount &&
      response.payer_id === request.payer_id;
    return isConsistent ? { kind: 'approved', response } : { kind: 'unexpected' };
  }
  if (response.status === 'rejected') return { kind: 'rejected', response };
  return { kind: 'system_error', response };
}
