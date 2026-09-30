import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '../../app/routes';
import { renderApp } from '../../test/renderApp';

// Flujo mínimo exigido para que la entrega sea válida, probado de punta a punta en la UI.
describe('flujo de autenticación', () => {
  it('sin sesión, el panel redirige a iniciar sesión', () => {
    const { router } = renderApp(ROUTES.dashboard);

    expect(router.state.location.pathname).toBe(ROUTES.login);
    expect(screen.getByRole('heading', { name: 'Inicia sesión' })).toBeInTheDocument();
  });

  it('registro → panel → cerrar sesión → iniciar sesión otra vez', async () => {
    const user = userEvent.setup();
    const { router } = renderApp(ROUTES.register);

    await user.type(screen.getByLabelText('Nombre completo'), 'Ana López');
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@correo.com');
    await user.type(screen.getByLabelText('Contraseña'), 'caracol123');
    await user.type(screen.getByLabelText('Confirma tu contraseña'), 'caracol123');
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(
      await screen.findByRole('heading', { name: 'Hola, Ana' }, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(router.state.location.pathname).toBe(ROUTES.login);

    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@correo.com');
    await user.type(screen.getByLabelText('Contraseña'), 'caracol123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(
      await screen.findByRole('heading', { name: 'Hola, Ana' }, { timeout: 5000 }),
    ).toBeInTheDocument();
  });

  it('muestra los errores de validación al intentar enviar vacío', async () => {
    const user = userEvent.setup();
    renderApp(ROUTES.register);

    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(screen.getByText('Escribe tu nombre completo.')).toBeInTheDocument();
    expect(screen.getByText('Escribe tu correo.')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toHaveAttribute('aria-invalid', 'true');
  });

  it('con contraseña incorrecta muestra un error y no entra', async () => {
    const user = userEvent.setup();
    renderApp(ROUTES.login);

    await user.type(screen.getByLabelText('Correo electrónico'), 'nadie@correo.com');
    await user.type(screen.getByLabelText('Contraseña'), 'caracol123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'El correo o la contraseña no son correctos.',
    );
  });
});
