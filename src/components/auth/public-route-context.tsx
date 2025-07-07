import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/store/authContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRouteContext({ children }: PublicRouteProps) {
  const { user, token } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  if (user && token) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
} 