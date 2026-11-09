import { Navigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D1710]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#C8A84B]" />
    </div>
  );
}

/** Login / register only when logged out; signed-in users skip to dashboard or admin. */
export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (user) {
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}
