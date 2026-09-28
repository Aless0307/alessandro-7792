import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SocialLogin } from './SocialLogin';

describe('SocialLogin', () => {
  it('explica que el proveedor no está disponible en lugar de no responder', async () => {
    const user = userEvent.setup();
    render(<SocialLogin />);

    await user.click(screen.getByRole('button', { name: 'Continuar con Google' }));

    expect(screen.getByRole('status')).toHaveTextContent('Entrar con Google no está disponible');
  });
});
