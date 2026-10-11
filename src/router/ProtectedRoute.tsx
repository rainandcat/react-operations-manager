import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { ManagerPermission } from '@/features/auth/types';
import { useManagerSession } from '@/features/auth/sessionStore';
import { AccessDeniedPage } from '@/pages/AccessDeniedPage';
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const session = useManagerSession((state) => state.session);
  const location = useLocation();
  if (!session) {
    return (
      <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
    );
  }
  return children;
}
export function RequirePermission({
  permission,
  children
}: {
  permission: ManagerPermission;
  children: ReactNode;
}) {
  const hasPermission = useManagerSession((state) =>
    Boolean(state.session?.permissions.includes(permission))
  );
  return hasPermission ? children : <AccessDeniedPage />;
}
