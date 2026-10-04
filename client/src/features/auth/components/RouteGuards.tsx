import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../authContext';
import { ROUTES } from '../../../app/routes';

export function RequireAuth() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to={ROUTES.login} replace />;
}

export function RequireGuest() {
  const { user } = useAuth();
  return user ? <Navigate to={ROUTES.dashboard} replace /> : <Outlet />;
}
