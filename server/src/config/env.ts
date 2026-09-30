// Única fuente de configuración del backend. Nada más en el código lee process.env.
export const env = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  snailpay: {
    // SNAILPAY_FORCE_OUTAGE=true simula que SnailPay está caído (error del sistema).
    forceOutage: process.env.SNAILPAY_FORCE_OUTAGE === 'true',
    // Demora de la tarjeta de respuesta lenta; mayor al timeout del frontend (8 s).
    slowResponseMs: Number(process.env.SNAILPAY_SLOW_RESPONSE_MS ?? 15_000),
  },
};
