import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/store/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRouteContext({ children }: ProtectedRouteProps) {
  const { user, token } = useAuth();
  const location = useLocation();

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 