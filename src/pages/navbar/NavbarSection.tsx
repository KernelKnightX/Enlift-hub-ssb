import { Link, useNavigate, useLocation } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavLink {
  label: string;
  path: string;
}
interface NavDropdown {
  label: string;
  dropdown: NavLink[];
}

type NavItem = NavLink | NavDropdown;

const WHATSAPP_NUMBER = '918638075112'; // Your number without + or spaces

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  {
    label: 'Defence Guide',
    dropdown: [
      { label: 'About SSB', path: '/ssb-about' },
      { label: 'SSB Process', path: '/ssb-process' },
      { label: 'Officer Qualities', path: '/ssb-qualities' },
      { label: 'Aspirant Lifestyle', path: '/ssb-lifestyle' },
    ],
  },
  {
    label: 'Preparation Guide',
    dropdown: [
      { label: 'Overview', path: '/ssb-preparation' },
      { label: 'Lecturette', path: '/ssb-lecturette' },
      { label: 'Personal Interview', path: '/ssb-interview' },
      { label: 'Group Discussion', path: '/ssb-group-discussion' },
      { label: 'GTO Tasks', path: '/ssb-gto' },
      { label: 'Conference', path: '/ssb-conference' },
    ],
  },
  { label: 'Mentorship', path: '/mentorship' },
  { label: 'Magazine', path: '/subscription' },
  { label: 'Blogs', path: '/blog' },
];

const css = `
  .nav { 
    position: fixed; 
    top: 0; 
    left: 0; 
    right: 0; 
    z-index: 200; 
    transition: all 0.3s; 
    background: rgba(13,23,16,0.95); 
    backdrop-filter: blur(10px); 
    border-bottom: 1px solid rgba(200,168,75,0.1); 
  }
  .nav.scrolled { 
    background: rgba(13,23,16,0.97); 
    backdrop-filter: blur(20px); 
    border-bottom: 1px solid rgba(200,168,75,0.15); 
    box-shadow: 0 4px 40px rgba(0,0,0,0.3); 
  }
  .nav-inner { 
    max-width: 1400px; 
    margin: 0 auto; 
    padding: 0 32px; 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    height: 72px; 
  }
  .nav-logo { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    text-decoration: none; 
  }
  .nav-logo img { height: 38px; width: auto; }
  .nav-logo-wrap { display: flex; flex-direction: column; }
  .nav-logo-name { 
    font-family: 'Inter', system-ui, -apple-system, sans-serif; 
    font-size: 1.5rem; 
    font-weight: 700; 
    color: #fff; 
    letter-spacing: 0.02em; 
    line-height: 1; 
  }
  .nav-logo-tag { 
    font-family: 'Inter', system-ui, -apple-system, sans-serif; 
    font-size: 9px; 
    letter-spacing: 0.2em; 
    text-transform: uppercase; 
    color: #C8A84B; 
    font-weight: 600; 
  }
  .nav-links { display: flex; align-items: center; gap: 2px; }
  .nav-link { 
    font-size: 13px; 
    font-weight: 500; 
    color: rgba(255,255,255,0.75); 
    text-decoration: none; 
    padding: 8px 14px; 
    border-radius: 4px; 
    transition: all 0.2s; 
    letter-spacing: 0.02em; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
  .nav-link:hover, .nav-link.active { 
    color: #fff; 
    background: rgba(255,255,255,0.08); 
  }
  .nav-dropdown-wrap { position: relative; z-index: 10; }
  .nav-dropdown-btn { 
    font-size: 13px; 
    font-weight: 500; 
    color: rgba(255,255,255,0.75); 
    background: none; 
    border: none; 
    cursor: pointer; 
    padding: 8px 14px; 
    border-radius: 4px; 
    display: flex; 
    align-items: center; 
    gap: 5px; 
    transition: all 0.2s; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
  .nav-dropdown-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }
  .nav-dropdown { 
    position: absolute; 
    top: calc(100% + 2px); /* smaller gap so mouse can reach menu */
    left: 0; 
    z-index: 100;
    background: #243325; 
    border: 1px solid rgba(200,168,75,0.2); 
    border-radius: 8px; 
    overflow: hidden; 
    min-width: 210px; 
    box-shadow: 0 24px 60px rgba(0,0,0,0.5); 
  }
  .nav-dropdown-item { 
    display: block; 
    padding: 14px 20px; 
    text-decoration: none; 
    border-bottom: 1px solid rgba(255,255,255,0.05); 
    transition: background 0.15s; 
  }
  .nav-dropdown-item:last-child { border-bottom: none; }
  .nav-dropdown-item:hover { background: rgba(200,168,75,0.1); }
  .nav-dropdown-item-name { font-size: 13px; font-weight: 600; color: #fff; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
  .nav-dropdown-item-price { font-size: 12px; color: #C8A84B; margin-top: 2px; }
  .nav-actions { display: flex; align-items: center; gap: 10px; }
  .nav-btn-ghost { 
    background: none; 
    border: 1px solid rgba(255,255,255,0.2); 
    color: rgba(255,255,255,0.8); 
    font-size: 13px; 
    font-weight: 500; 
    padding: 8px 18px; 
    border-radius: 4px; 
    cursor: pointer; 
    transition: all 0.2s; 
    text-decoration: none; 
    display: inline-flex; 
    align-items: center; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
  .nav-btn-ghost:hover { border-color: rgba(255,255,255,0.5); color: #fff; }
  .nav-btn-primary { 
    background: #C8A84B; 
    color: #0d1710; 
    font-size: 13px; 
    font-weight: 700; 
    padding: 9px 20px; 
    border-radius: 4px; 
    cursor: pointer; 
    transition: all 0.2s; 
    text-decoration: none; 
    display: inline-flex; 
    align-items: center; 
    border: none; 
    letter-spacing: 0.03em; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
  .nav-btn-primary:hover { background: #E2C26A; }
  .nav-hamburger { display: none; background: none; border: none; color: #fff; cursor: pointer; }
  .nav-mobile { 
    display: none; 
    background: #1A2A1B; 
    border-top: 1px solid rgba(255,255,255,0.05);
    max-height: 80vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .nav-mobile.open { display: block; }
  .nav-mobile-inner { padding: 20px 24px; display: flex; flex-direction: column; gap: 2px; }
  .nav-mobile-link { 
    font-size: 15px; 
    font-weight: 500; 
    color: rgba(255,255,255,0.8); 
    text-decoration: none; 
    padding: 14px 0; 
    border-bottom: 1px solid rgba(255,255,255,0.05); 
    display: block; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
  .nav-mobile-btns { display: flex; gap: 10px; padding-top: 20px; }

  @media (max-width: 1024px) {
    .nav-inner { padding: 0 16px; }
    .nav-links { display: none; }
    .nav-hamburger { display: block; }
    .nav-actions { display: none; }
  }
  @media (max-width: 480px) {
    .nav-inner { padding: 0 12px; height: 64px; }
    .nav-logo img { height: 30px; }
    .nav-logo-name { font-size: 1.2rem; }
    .nav-logo-tag { font-size: 7px; }
  }
`;

export function NavbarSection() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // Don't close dropdown if clicking on dropdown items or the dropdown button
      const target = e.target as Element;
      const isDropdownItem = target.closest('.nav-dropdown-item');
      const isDropdownBtn = target.closest('.nav-dropdown-btn');
      const isDropdown = target.closest('.nav-dropdown');
      
      if (dropRef.current && !dropRef.current.contains(target)) {
        // Only close if not interacting with any dropdown
        if (!isDropdownItem && !isDropdownBtn && !isDropdown) {
          setOpenDropdown(null);
        }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <img src="/AbhyasSSB1.png" alt="Enlift hub" />
          <div className="nav-logo-wrap">
            <span className="nav-logo-name">Enlift hub</span>
            <span className="nav-logo-tag">The guide to defence</span>
          </div>
        </Link>

        <div className="nav-links">
          {navItems.map(item => {
            if ('dropdown' in item) {
              const isOpen = openDropdown === item.label;
              return (
                <div
                  key={item.label}
                  className="nav-dropdown-wrap"
                  onMouseEnter={() => {
                    if (dropdownTimeout) clearTimeout(dropdownTimeout);
                    setOpenDropdown(item.label);
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => setOpenDropdown(null), 500);
                    setDropdownTimeout(timeout);
                  }}
                >
                  <button 
                    className="nav-dropdown-btn"
                    onClick={() => {
                      setOpenDropdown(isOpen ? null : item.label);
                    }}
                  >
                    {item.label} <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </button>
                  {isOpen && (
                    <div
                      className="nav-dropdown"
                      onClick={(e) => {
                        // Don't close on dropdown click - let the link handle navigation
                        e.stopPropagation();
                      }}
                    >
                      {item.dropdown.map(sub => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className="nav-dropdown-item"
                        >
                          <span className="nav-dropdown-item-name">{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link${location.pathname === item.path ? ' active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-btn-ghost">Dashboard</Link>
              <Link to="/membership" className="nav-btn-ghost">My Membership</Link>
              <button className="nav-btn-ghost" onClick={() => { logout(); navigate('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn-ghost">Login</Link>
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'm interested in Enlift Hub SSB coaching programs")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-btn-primary"
              >
                Apply Now
              </a>
            </>
          )}
        </div>

        <button className="nav-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`}>
        <div className="nav-mobile-inner">
          {navItems.map(item => {
            if ('dropdown' in item) {
              return item.dropdown.map(sub => (
                <Link
                  key={sub.path}
                  to={sub.path}
                  className="nav-mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {sub.label}
                </Link>
              ));
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                className="nav-mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="nav-mobile-btns">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-btn-ghost" style={{ flex: 1, textAlign: 'center' }} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <button className="nav-btn-ghost" onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-btn-ghost" style={{ flex: 1, textAlign: 'center' }} onClick={() => setMobileOpen(false)}>Login</Link>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'm interested in Enlift Hub SSB coaching programs")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-btn-primary"
                  style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Apply Now
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
