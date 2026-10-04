import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { serveClient } from './middleware/serveClient';
import { healthRouter } from './modules/health/health.routes';
import { createSnailPayRouter } from './modules/snailpay/snailpay.routes';
import type { SnailPayConfig } from './modules/snailpay/snailpay.service';

interface AppOptions {
  snailpay?: Partial<SnailPayConfig>;
  // build del front; si viene, también se sirve
  clientDistDir?: string | null;
}

// Separado de index.ts para poder probarlo con Supertest. Las opciones son para los tests.
export function createApp(options: AppOptions = {}) {
  const app = express();
  const clientDistDir =
    options.clientDistDir !== undefined ? options.clientDistDir : env.clientDistDir;

  app.disable('x-powered-by');
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: '10kb' }));

  app.use('/api/health', healthRouter);
  app.use('/api/snailpay', createSnailPayRouter({ ...env.snailpay, ...options.snailpay }));

  // en prod el mismo server sirve el front: una sola URL y sin CORS
  if (clientDistDir) app.use(serveClient(clientDistDir));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
