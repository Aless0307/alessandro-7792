// Única fuente de configuración del frontend. Vacío = mismo origen (proxy de Vite en desarrollo).
export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? '';
