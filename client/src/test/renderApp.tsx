import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { appRoutes } from '../app/router';
import { AuthProvider } from '../features/auth/AuthProvider';

// Monta la app completa en una ruta dada, con un router en memoria en lugar del navegador.
export function renderApp(initialPath: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [initialPath] });
  const view = render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>,
  );
  return { ...view, router };
}
