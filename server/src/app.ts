import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { healthRouter } from './modules/health/health.routes';

// Se separa de index.ts para poder probar la app con Supertest sin abrir un puerto.
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: '10kb' }));

  app.use('/api/health', healthRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
