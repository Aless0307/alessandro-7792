import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('se cierra con Esc y con el botón de cerrar', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal title="Recargar saldo" onClose={onClose}>
        <input aria-label="Monto" />
      </Modal>,
    );

    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('no se puede cerrar mientras hay una operación en curso', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal title="Recargar saldo" onClose={onClose} canClose={false}>
        <input aria-label="Monto" />
      </Modal>,
    );

    await user.keyboard('{Escape}');

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeDisabled();
  });

  it('pone el foco en el primer campo al abrirse', () => {
    render(
      <Modal title="Recargar saldo" onClose={() => {}}>
        <input aria-label="Monto" />
      </Modal>,
    );

    expect(screen.getByLabelText('Monto')).toHaveFocus();
  });
});
