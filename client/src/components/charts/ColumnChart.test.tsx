import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ColumnChart } from './ColumnChart';

const data = [
  { id: 'turbo', label: 'Turbo', value: 2 },
  { id: 'lechuga', label: 'Lechuga', value: 0 },
];
const format = (value: number) => `${value} victorias`;

describe('ColumnChart', () => {
  it('muestra el tooltip al llegar a una columna con el teclado', async () => {
    const user = userEvent.setup();
    render(<ColumnChart title="Victorias" data={data} formatValue={format} />);

    await user.tab();

    expect(screen.getByRole('tooltip')).toHaveTextContent('Turbo2 victorias');
  });

  it('rotula solo las columnas resaltadas', () => {
    render(
      <ColumnChart title="Victorias" data={data} highlightIds={['turbo']} formatValue={format} />,
    );

    expect(screen.getByLabelText('Turbo: 2 victorias').textContent).toBe('2');
    expect(screen.getByLabelText('Lechuga: 0 victorias').textContent).toBe('');
  });

  it('incluye una tabla equivalente para lectores de pantalla', () => {
    render(<ColumnChart title="Victorias" data={data} formatValue={format} />);

    const table = screen.getByRole('table', { name: 'Victorias' });
    expect(table).toHaveTextContent('Turbo2 victorias');
    expect(table).toHaveTextContent('Lechuga0 victorias');
  });
});
