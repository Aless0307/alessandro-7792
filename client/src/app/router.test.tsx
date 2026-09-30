import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../test/renderApp';
import { ROUTES } from './routes';

describe('rutas', () => {
  it('una dirección que no existe muestra una página propia, no un error del framework', () => {
    renderApp('/no-existe');

    expect(screen.getByRole('heading', { name: 'Esta página no existe' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ir al inicio' })).toBeInTheDocument();
  });

  it('la raíz lleva al inicio de sesión si no hay sesión', () => {
    const { router } = renderApp('/');

    expect(router.state.location.pathname).toBe(ROUTES.login);
  });
});
