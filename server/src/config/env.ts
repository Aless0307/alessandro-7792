// Única fuente de configuración del backend. Nada más en el código lee process.env.
export const env = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
};
