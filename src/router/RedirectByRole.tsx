import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function RedirectByRole() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/client" replace />;
}
