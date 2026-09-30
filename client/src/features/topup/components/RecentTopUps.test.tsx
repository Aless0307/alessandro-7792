import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { chargeResponse } from '../../../test/snailpayFixtures';
import { RecentTopUps } from './RecentTopUps';

describe('RecentTopUps', () => {
  it('invita a recargar cuando no hay operaciones', () => {
    render(<RecentTopUps charges={[]} onTopUp={() => {}} />);

    expect(screen.getByText(/Aún no has recargado saldo/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recargar saldo' })).toBeInTheDocument();
  });

  it('muestra el estado con texto, no solo con color', () => {
    render(
      <RecentTopUps
        onTopUp={() => {}}
        charges={[
          chargeResponse({ status: 'approved' }),
          chargeResponse({ status: 'rejected', date_created: '2026-09-30T11:00:00.000Z' }),
          chargeResponse({ status: 'error', date_created: '2026-09-30T10:00:00.000Z' }),
        ]}
      />,
    );

    expect(screen.getByText('Aprobada')).toBeInTheDocument();
    expect(screen.getByText('Rechazada')).toBeInTheDocument();
    expect(screen.getByText('No procesada')).toBeInTheDocument();
  });

  it('muestra las 5 más recientes, de la más nueva a la más vieja', () => {
    const charges = Array.from({ length: 7 }, (_, day) =>
      chargeResponse({
        transaction_amount: day + 1,
        date_created: `2026-09-0${day + 1}T12:00:00.000Z`,
      }),
    );

    render(<RecentTopUps charges={charges} onTopUp={() => {}} />);

    const amounts = screen.getAllByText(/^\+\$/).map((element) => element.textContent);
    expect(amounts).toEqual(['+$7.00', '+$6.00', '+$5.00', '+$4.00', '+$3.00']);
  });

  it('nunca muestra el número de tarjeta completo', () => {
    render(<RecentTopUps charges={[chargeResponse()]} onTopUp={() => {}} />);

    expect(screen.queryByText(/1234123412341234/)).toBeNull();
    expect(screen.getByText(/•••• 1234/)).toBeInTheDocument();
  });
});
