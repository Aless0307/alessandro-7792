import type { NextFunction, Request, Response } from 'express';

// Express reconoce el handler de errores por los 4 parámetros, aunque next no se use
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (isJsonParseError(err)) {
    res.status(400).json({ message: 'El cuerpo de la petición no es un JSON válido.' });
    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor.' });
}

function isJsonParseError(err: unknown): boolean {
  return (
    typeof err === 'object' && err !== null && 'type' in err && err.type === 'entity.parse.failed'
  );
}
