import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { Crown, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ADMIN_CSS } from '@/components/admin/adminStyles';
import { BrandLogo } from '@/components/BrandLogo';
import { BRAND_NAME } from '@/lib/siteBranding';

type Props = {
  children: ReactNode;
  /** Optional row under header (page title + actions). */
  toolbar?: ReactNode;
  /** Show link back to admin home in toolbar area. */
  showAdminHomeLink?: boolean;
};

export function AdminShell({ children, toolbar, showAdminHomeLink }: Props) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="adm-root">
      <style>{ADMIN_CSS}</style>
      <header className="adm-header">
        <div className="adm-header-inner">
          <Link to="/admin" className="adm-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
            <BrandLogo variant="nav" className="h-10 w-20 shrink-0 rounded-md bg-white object-contain" loading="eager" />
            <div>
              <div className="adm-brand-title">{BRAND_NAME}</div>
              <div className="adm-brand-sub">Admin Dashboard · Central Mock Test Management</div>
            </div>
          </Link>
          <div className="adm-header-right">
            <span className="adm-pill-gold">
              <Crown size={12} />
              Admin
            </span>
            <span className="adm-user">{user?.fullName || 'Administrator'}</span>
            <button type="button" className="adm-logout" onClick={handleLogout}>
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
        {(toolbar || showAdminHomeLink) && (
          <div className="adm-toolbar">
            {showAdminHomeLink ? (
              <Link to="/admin" className="adm-back" style={{ textDecoration: 'none' }}>
                ← Admin home
              </Link>
            ) : (
              <span />
            )}
            {toolbar ? <div className="adm-toolbar-actions">{toolbar}</div> : null}
          </div>
        )}
      </header>

      <main className="adm-main">{children}</main>

      <footer className="adm-footer">
        <div className="adm-footer-inner">
          <span>© {new Date().getFullYear()} {BRAND_NAME} · Secure defence exam CBT admin environment</span>
          <span className="adm-footer-ok">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            All systems nominal
          </span>
        </div>
      </footer>
    </div>
  );
}
