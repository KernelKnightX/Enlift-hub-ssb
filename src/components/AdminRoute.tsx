import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Check if user is authenticated and is admin
  // We check user first to avoid redirecting during auth state transitions
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
