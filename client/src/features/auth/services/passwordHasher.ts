// La contraseña nunca se guarda: se guarda un hash PBKDF2-SHA256 con sal aleatoria por usuario.
// La sal evita que dos usuarios con la misma contraseña tengan el mismo hash, y las
// iteraciones hacen costoso probar contraseñas por fuerza bruta (valor recomendado por OWASP).
export const PBKDF2_ITERATIONS = 600_000;
const SALT_BYTES = 16;
const HASH_BITS = 256;

export interface PasswordHash {
  hash: string;
  salt: string;
  iterations: number;
}

export async function hashPassword(
  password: string,
  iterations: number = PBKDF2_ITERATIONS,
): Promise<PasswordHash> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await deriveKey(password, salt, iterations);
  return { hash: toBase64(hash), salt: toBase64(salt), iterations };
}

export async function verifyPassword(password: string, stored: PasswordHash): Promise<boolean> {
  const candidate = await deriveKey(password, fromBase64(stored.salt), stored.iterations);
  return constantTimeEqual(candidate, fromBase64(stored.hash));
}

async function deriveKey(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number,
): Promise<Uint8Array<ArrayBuffer>> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    keyMaterial,
    HASH_BITS,
  );
  return new Uint8Array(bits);
}

// Compara todos los bytes siempre, para no revelar por tiempo de respuesta cuántos coinciden.
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}
