import { Link } from 'react-router';
import { MapPin, Phone, Mail } from 'lucide-react';

const css = `
  .footer { background: #1A2A1B; border-top: 1px solid rgba(200,168,75,0.1); padding: 72px 32px 40px; }
  .footer-inner { max-width: 1400px; margin: 0 auto; }
  .footer-top { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
  .footer-brand-name { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: #fff; letter-spacing: 0.08em; margin-bottom: 4px; }
  .footer-brand-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #C8A84B; margin-bottom: 16px; display: block; }
  .footer-brand-desc { font-size: 13px; color: rgba(255,255,255,0.3); line-height: 1.75; max-width: 260px; }
  .footer-contact { margin-top: 24px; display: flex; flex-direction: column; gap: 10px; }
  .footer-contact-item { display: flex; gap: 10px; align-items: center; font-size: 13px; color: rgba(255,255,255,0.4); }
  .footer-col-title { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 20px; }
  .footer-link { display: block; font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; margin-bottom: 12px; transition: color 0.15s; }
  .footer-link:hover { color: #C8A84B; }
  .footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.05); }
  .footer-copy { font-size: 12px; color: rgba(255,255,255,0.2); }
  .footer-disc { font-size: 12px; color: rgba(255,255,255,0.15); }

  @media (max-width: 1024px) {
    .footer-top { grid-template-columns: 1fr 1fr; gap: 40px; }
  }

  @media (max-width: 768px) {
    .footer { padding: 48px 24px 32px; }
    .footer-top { grid-template-columns: 1fr; gap: 28px; }
    .footer-bottom { flex-direction: column; text-align: center; }
  }
`;

export function FooterSection() {
  return (
    <>
      <style>{css}</style>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand-name">Enlift hub</div>
              <span className="footer-brand-tag">The guide to defence</span>
              <p className="footer-brand-desc">
                A focused SSB practice platform for learning the process, reviewing preparation guidance, and building a consistent practice routine.
              </p>
              <div className="footer-contact">
                <div className="footer-contact-item">
                  <MapPin size={13} /> Coaching Centre Address · City, State
                </div>
                <div className="footer-contact-item">
                  <Phone size={13} /> +91 XXXXX XXXXX
                </div>
                <div className="footer-contact-item">
                  <Mail size={13} /> info@enliftssb.com
                </div>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Platform</div>
              {[
                { label: 'Home', path: '/' },
                { label: 'Dashboard', path: '/dashboard' },
                { label: 'SSB Preparation', path: '/ssb-preparation' },
                { label: 'Mock Tests', path: '/mock-tests' },
              ].map(l => (
                <Link key={l.label} to={l.path} className="footer-link">{l.label}</Link>
              ))}
            </div>

            <div>
              <div className="footer-col-title">Psychology Practice</div>
              {[
                { label: 'PPDT', path: '/ppdt/sets' },
                { label: 'TAT', path: '/tat/sets' },
                { label: 'WAT', path: '/wat/sets' },
                { label: 'SRT', path: '/srt/sets' },
                { label: 'OPAM', path: '/opam/sets' },
              ].map(l => (
                <Link key={l.label} to={l.path} className="footer-link">{l.label}</Link>
              ))}
            </div>

            <div>
              <div className="footer-col-title">Account</div>
              {[
                { label: 'Register', path: '/register' },
                { label: 'Login', path: '/login' },
                { label: 'Terms & Conditions', path: '/terms' },
              ].map(l => (
                <Link key={l.label} to={l.path} className="footer-link">{l.label}</Link>
              ))}
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">© {new Date().getFullYear()} Enlift hub. All rights reserved.</p>
            <p className="footer-disc">Independent practice platform. Not affiliated with Indian Armed Forces or any SSB board.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
