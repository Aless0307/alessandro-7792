import { randomInt, randomUUID } from 'node:crypto';
import {
  chargeRequestSchema,
  type ChargeResponse,
  type ChargeStatus,
  type ChargeStatusDetail,
  type FieldError,
} from '@snail/shared';
import { APPROVED_CARD, MESSAGES, TEST_CARDS } from './snailpay.scenarios';

export interface SnailPayConfig {
  // todo responde 503
  forceOutage: boolean;
  // demora de la tarjeta lenta
  slowResponseMs: number;
}

export interface ChargeResult {
  httpStatus: number;
  body: ChargeResponse;
}

const HTTP_STATUS: Record<ChargeStatusDetail, number> = {
  accredited: 201,
  invalid_data: 422,
  invalid_card_data: 402,
  card_declined: 402,
  insufficient_funds: 402,
  expired_card: 402,
  unknown_card: 402,
  service_unavailable: 503,
  gateway_timeout: 504,
};

// El orden importa: caída forzada → formato → tarjetas de prueba.
export async function processCharge(input: unknown, config: SnailPayConfig): Promise<ChargeResult> {
  if (config.forceOutage) {
    return respond('error', 'service_unavailable', echoRawInput(input));
  }

  const parsed = chargeRequestSchema.safeParse(input);
  if (!parsed.success) {
    const errors: FieldError[] = parsed.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return respond('rejected', 'invalid_data', echoRawInput(input), errors);
  }

  const request = parsed.data;
  const echo: Echo = {
    transaction_amount: request.amount,
    payer_id: request.payer_id,
    payer_email: request.payer_email,
    card_number: request.card_number,
    cvv: request.cvv,
  };

  const scenario = TEST_CARDS[request.card_number];
  if (scenario?.kind === 'slow_response') {
    await sleep(config.slowResponseMs);
    return respond('error', 'gateway_timeout', echo);
  }
  if (scenario?.kind === 'result') {
    return respond(scenario.status, scenario.detail, echo);
  }

  if (request.card_number === APPROVED_CARD.number) {
    const matches =
      request.expiration_date === APPROVED_CARD.expirationDate && request.cvv === APPROVED_CARD.cvv;
    return matches
      ? respond('approved', 'accredited', echo)
      : respond('rejected', 'invalid_card_data', echo);
  }

  return respond('rejected', 'unknown_card', echo);
}

type Echo = Pick<
  ChargeResponse,
  'transaction_amount' | 'payer_id' | 'payer_email' | 'card_number' | 'cvv'
>;

function respond(
  status: ChargeStatus,
  detail: ChargeStatusDetail,
  echo: Echo,
  errors?: FieldError[],
): ChargeResult {
  const now = new Date();
  const body: ChargeResponse = {
    id: `pay_${randomUUID()}`,
    status,
    status_detail: detail,
    message: MESSAGES[detail],
    ...echo,
    date_created: now.toISOString(),
    // solo los aprobados llevan autorización
    authorization_code: status === 'approved' ? String(randomInt(100000, 1000000)) : null,
    reference: buildReference(now),
    ...(errors && { errors }),
  };
  return { httpStatus: HTTP_STATUS[detail], body };
}

// SNP-AAAAMMDD-XXXXXX
function buildReference(date: Date): string {
  const day = date.toISOString().slice(0, 10).replaceAll('-', '');
  const suffix = randomUUID().replaceAll('-', '').slice(0, 6).toUpperCase();
  return `SNP-${day}-${suffix}`;
}

// Con datos inválidos se devuelve lo que llegó, pero solo strings/números y recortados.
function echoRawInput(input: unknown): Echo {
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;
  const text = (value: unknown) => (typeof value === 'string' ? value.slice(0, 64) : null);
  return {
    transaction_amount: typeof raw.amount === 'number' ? raw.amount : null,
    payer_id: text(raw.payer_id),
    payer_email: text(raw.payer_email),
    card_number: text(raw.card_number),
    cvv: text(raw.cvv),
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
