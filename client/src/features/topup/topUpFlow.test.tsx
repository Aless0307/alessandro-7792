import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ROUTES } from '../../app/routes';
import { chargeResponse } from '../../test/snailpayFixtures';
import { renderApp } from '../../test/renderApp';
import { register } from '../auth/services/authService';

// Responde como SnailPay, reflejando el monto y el usuario de la petición.
function stubSnailPay(overrides: Parameters<typeof chargeResponse>[0], status: number) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      const response = chargeResponse({
        transaction_amount: body.amount,
        payer_id: body.payer_id,
        ...overrides,
      });
      return new Response(JSON.stringify(response), { status });
    }),
  );
}

async function openTopUpAndPay(cardLabel: string, amount: string) {
  const user = userEvent.setup();
  // El primero es el de la tarjeta de saldo; el historial vacío tiene otro igual.
  await user.click((await screen.findAllByRole('button', { name: 'Recargar saldo' }))[0]!);
  const dialog = screen.getByRole('dialog', { name: 'Recargar saldo' });

  await user.click(within(dialog).getByText('Tarjetas de prueba'));
  await user.click(within(dialog).getByRole('button', { name: new RegExp(cardLabel) }));
  await user.type(within(dialog).getByLabelText('Monto a recargar (MXN)'), amount);
  await user.click(within(dialog).getByRole('button', { name: /^Pagar/ }));
  return { user, dialog };
}

describe('recarga de saldo desde el panel', () => {
  beforeEach(async () => {
    await register({
      fullName: 'Ana López',
      email: 'ana@correo.com',
      password: 'caracol123',
      confirmPassword: 'caracol123',
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('un pago aprobado actualiza el saldo del panel de inmediato', async () => {
    stubSnailPay({}, 201);
    renderApp(ROUTES.dashboard);

    const { user, dialog } = await openTopUpAndPay('Pago aprobado', '250');

    expect(await within(dialog).findByText('Recarga aprobada')).toBeInTheDocument();
    expect(within(dialog).getByText('+$250.00')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Listo' }));
    expect(screen.getByText('$250.00')).toBeInTheDocument();
  });

  it('un pago rechazado muestra el motivo y deja el saldo igual', async () => {
    stubSnailPay(
      {
        status: 'rejected',
        status_detail: 'card_declined',
        message: 'Tu banco rechazó el pago. Prueba con otra tarjeta.',
        authorization_code: null,
      },
      402,
    );
    renderApp(ROUTES.dashboard);

    const { dialog } = await openTopUpAndPay('Tarjeta rechazada', '250');

    const alert = await within(dialog).findByRole('alert');
    expect(alert).toHaveTextContent('Pago rechazado');
    expect(alert).toHaveTextContent('Tu banco rechazó el pago');
    expect(alert).toHaveTextContent('Tu saldo no cambió.');
    // aunque el usuario esté desplazado hasta abajo, el aviso recibe el foco
    expect(alert).toHaveFocus();
    expect(screen.getAllByText('$0.00').length).toBeGreaterThan(0);
  });

  it('valida el formulario antes de llamar a SnailPay', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderApp(ROUTES.dashboard);

    // El primero es el de la tarjeta de saldo; el historial vacío tiene otro igual.
    await user.click((await screen.findAllByRole('button', { name: 'Recargar saldo' }))[0]!);
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Pagar' }));

    expect(
      within(dialog).getByText('El número de tarjeta debe tener 16 dígitos.'),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
