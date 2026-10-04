import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../app';

describe('servir el frontend en producción', () => {
  let distDir: string;

  beforeAll(() => {
    distDir = mkdtempSync(path.join(tmpdir(), 'client-dist-'));
    writeFileSync(path.join(distDir, 'index.html'), '<div id="root"></div>');
    writeFileSync(path.join(distDir, 'app.js'), 'console.log("app")');
  });

  it('entrega los archivos estáticos', async () => {
    const res = await request(createApp({ clientDistDir: distDir })).get('/app.js');

    expect(res.status).toBe(200);
    expect(res.text).toContain('console.log');
  });

  it('devuelve index.html en las rutas del frontend para que React Router las resuelva', async () => {
    const res = await request(createApp({ clientDistDir: distDir })).get('/panel');

    expect(res.status).toBe(200);
    expect(res.text).toContain('<div id="root"></div>');
  });

  it('una ruta de API inexistente sigue respondiendo 404 en JSON', async () => {
    const res = await request(createApp({ clientDistDir: distDir })).get('/api/no-existe');

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('/api/no-existe');
  });

  it('sin carpeta del frontend (desarrollo) no sirve nada fuera de la API', async () => {
    const res = await request(createApp({ clientDistDir: null })).get('/panel');

    expect(res.status).toBe(404);
  });
});
