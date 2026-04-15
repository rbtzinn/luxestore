import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function AdminRoute() {
  const location = useLocation();
  const { enabled, isReady, isAuthenticated, isAdmin } = useAuth();

  if (!enabled) {
    return <Outlet />;
  }

  if (!isReady) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Carregando autenticacao...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
