import { fileURLToPath } from 'node:url';

const isProduction = process.env.NODE_ENV === 'production';

// Toda la config del backend se lee aquí.
export const env = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  // en prod Express también sirve el build del front; la ruta funciona desde src/ y desde dist/
  clientDistDir: isProduction ? fileURLToPath(new URL('../../client/dist', import.meta.url)) : null,
  snailpay: {
    // true = SnailPay caído, todo responde 503
    forceOutage: process.env.SNAILPAY_FORCE_OUTAGE === 'true',
    // tiene que ser mayor al timeout del front (8 s)
    slowResponseMs: Number(process.env.SNAILPAY_SLOW_RESPONSE_MS ?? 15_000),
  },
};
