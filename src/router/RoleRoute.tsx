import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, type UserRole } from '@/context/AuthContext';

type RoleRouteProps = {
  allowedRoles: UserRole[];
};

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    const fallback = user?.role === 'admin' ? '/admin' : '/client';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
