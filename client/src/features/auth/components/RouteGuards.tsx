import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../authContext';
import { ROUTES } from '../../../app/routes';

// Solo con sesión activa: si no, se envía al inicio de sesión.
export function RequireAuth() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to={ROUTES.login} replace />;
}

// Solo sin sesión: quien ya entró no necesita ver login ni registro.
export function RequireGuest() {
  const { user } = useAuth();
  return user ? <Navigate to={ROUTES.dashboard} replace /> : <Outlet />;
}
