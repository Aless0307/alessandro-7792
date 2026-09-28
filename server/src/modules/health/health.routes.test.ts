import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../app';

describe('API base', () => {
  const app = createApp();

  it('GET /api/health responde ok', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.timestamp).toBe('string');
  });

  it('responde 404 en JSON para rutas desconocidas', async () => {
    const res = await request(app).get('/api/no-existe');

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('/api/no-existe');
  });

  it('responde 400 cuando el JSON del cuerpo está mal formado', async () => {
    const res = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('{mal json');

    expect(res.status).toBe(400);
  });
});
