import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AuthProvider } from '../features/auth/AuthProvider';
import { appRoutes } from './router';

export function App() {
  const [router] = useState(() => createBrowserRouter(appRoutes));

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
