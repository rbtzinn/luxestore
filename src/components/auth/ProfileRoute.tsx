import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProfileRoute() {
  const location = useLocation();
  const { enabled, isAuthenticated, isReady } = useAuth();

  if (!enabled) {
    // For demo purposes and since the user requested to see the profile page, we allow access even if auth is disabled.
    return <Outlet />;
  }

  if (!isReady) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Carregando autenticacao...</div>;
  }

  if (!isAuthenticated) {
    // Return to auth if enabled but not authenticated
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
