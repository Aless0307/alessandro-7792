// vacío = mismo origen (en dev pasa por el proxy de Vite)
export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? '';

export const SNAILPAY_TIMEOUT_MS = 8_000;
