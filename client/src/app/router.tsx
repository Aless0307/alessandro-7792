import { Navigate, type RouteObject } from 'react-router';
import { RequireAuth, RequireGuest } from '../features/auth/components/RouteGuards';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ROUTES } from './routes';

export const appRoutes: RouteObject[] = [
  {
    element: <RequireGuest />,
    children: [
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.register, element: <RegisterPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [{ path: ROUTES.dashboard, element: <DashboardPage /> }],
  },
  { path: '*', element: <Navigate to={ROUTES.dashboard} replace /> },
];
