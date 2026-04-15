import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProfileRoute() {
  const location = useLocation();
  const { enabled, isAuthenticated, isReady } = useAuth();

  if (!enabled) {
    return <Navigate to="/auth" replace />;
  }

  if (!isReady) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Carregando autenticacao...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
