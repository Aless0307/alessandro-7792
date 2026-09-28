import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

describe('App (fase 0)', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('muestra "API conectada" cuando el backend responde', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: 'ok', timestamp: '2026-01-01T00:00:00Z' })),
      ),
    );

    render(<App />);

    expect(await screen.findByText('API conectada')).toBeInTheDocument();
  });

  it('muestra un error cuando el backend no responde', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Failed to fetch')));

    render(<App />);

    expect(await screen.findByText(/No se pudo conectar/)).toBeInTheDocument();
  });
});
