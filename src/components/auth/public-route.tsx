import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, token } = useSelector((state: any) => state.auth);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  if (user && token) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
} 