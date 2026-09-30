// Única fuente de configuración del frontend. Vacío = mismo origen (proxy de Vite en desarrollo).
export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? '';

// Tiempo máximo de espera de SnailPay antes de cancelar y avisar al usuario.
export const SNAILPAY_TIMEOUT_MS = 8_000;
