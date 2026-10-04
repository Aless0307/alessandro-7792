import path from 'node:path';
import express, { Router } from 'express';

// Sirve el build del front. Cualquier GET que no sea /api recibe index.html para que
// React Router resuelva /panel, /crear-cuenta, etc.
export function serveClient(distDir: string) {
  const router = Router();
  const indexFile = path.join(distDir, 'index.html');

  router.use(express.static(distDir, { index: false }));
  router.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
    res.sendFile(indexFile);
  });

  return router;
}
