import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { healthRouter } from './modules/health/health.routes';
import { createSnailPayRouter } from './modules/snailpay/snailpay.routes';
import type { SnailPayConfig } from './modules/snailpay/snailpay.service';

interface AppOptions {
  snailpay?: Partial<SnailPayConfig>;
}

// Se separa de index.ts para poder probar la app con Supertest sin abrir un puerto.
// Las opciones permiten a las pruebas cambiar la configuración sin tocar process.env.
export function createApp(options: AppOptions = {}) {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: '10kb' }));

  app.use('/api/health', healthRouter);
  app.use('/api/snailpay', createSnailPayRouter({ ...env.snailpay, ...options.snailpay }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
