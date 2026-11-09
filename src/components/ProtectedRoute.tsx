import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef2f7]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-[#0b3d91]" />
    </div>
  );
}

/** Requires a signed-in candidate (or admin) before dashboard / mock tests. */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    const continueTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?continue=${encodeURIComponent(continueTo)}`} replace />;
  }

  return <>{children}</>;
}
