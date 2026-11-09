import { Link } from 'react-router';
import { Mail } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { BRAND_BYLINE, BRAND_NAME, BRAND_TAGLINE } from '@/lib/siteBranding';
import { SUPPORT_EMAIL } from '@/lib/siteSeo';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_EXAM_THEMES, MOCK_LISTING_EXAMS } from '@/components/mock-test/examThemes';

const css = `
  .ft {
    background: linear-gradient(180deg, #0f1f3d 0%, #0a1628 100%);
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 56px 24px 32px;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  .ft-inner { max-width: 1100px; margin: 0 auto; }
  .ft-top {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
  }
  .ft-brand-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .ft-logo {
    width: 42px; height: 42px; border-radius: 10px;
    background: rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
  }
  .ft-brand-name { font-size: 1.15rem; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
  .ft-brand-tag {
    font-size: 9px; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; color: rgba(255,255,255,0.45); margin-top: 2px;
  }
  .ft-desc { font-size: 13px; line-height: 1.65; color: rgba(255,255,255,0.5); max-width: 300px; }
  .ft-mail {
    margin-top: 18px;
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 13px; color: rgba(255,255,255,0.65);
    text-decoration: none;
  }
  .ft-mail:hover { color: #c8a84b; }
  .ft-col-title {
    font-size: 10px; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 16px;
  }
  .ft-link {
    display: block; font-size: 13px; color: rgba(255,255,255,0.55);
    text-decoration: none; margin-bottom: 10px; transition: color 0.15s;
  }
  .ft-link:hover { color: #fff; }
  .ft-exam-dot {
    display: inline-block; width: 6px; height: 6px; border-radius: 50%;
    margin-right: 8px; vertical-align: middle;
  }
  .ft-bottom {
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
    gap: 12px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08);
  }
  .ft-copy { font-size: 12px; color: rgba(255,255,255,0.35); }
  .ft-disc { font-size: 11px; color: rgba(255,255,255,0.28); max-width: 420px; line-height: 1.5; text-align: right; }

  @media (max-width: 900px) {
    .ft-top { grid-template-columns: 1fr 1fr; gap: 32px; }
  }
  @media (max-width: 560px) {
    .ft-top { grid-template-columns: 1fr; gap: 28px; }
    .ft-bottom { flex-direction: column; text-align: center; }
    .ft-disc { text-align: center; max-width: none; }
  }
`;

export function FooterSection() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <style>{css}</style>
      <footer className="ft">
        <div className="ft-inner">
          <div className="ft-top">
            <div>
              <div className="ft-brand-row">
                <BrandLogo variant="nav" className="h-10 w-auto max-w-[200px] object-contain brightness-110" />
                <div>
                  <div className="ft-brand-name">{BRAND_NAME}</div>
                  <div className="ft-brand-tag">{BRAND_BYLINE} · {BRAND_TAGLINE}</div>
                </div>
              </div>
              <p className="ft-desc">
                Timed mock tests for CDS and AFCAT. NDA mock tests are coming soon.
              </p>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="ft-mail">
                <Mail size={14} />
                {SUPPORT_EMAIL}
              </a>
            </div>

            <div>
              <div className="ft-col-title">Mock tests</div>
              {MOCK_LISTING_EXAMS.map((examId) => {
                const theme = MOCK_EXAM_THEMES[examId];
                return (
                  <Link key={examId} to={theme.route} className="ft-link">
                    <span className="ft-exam-dot" style={{ background: theme.primary }} />
                    {examId} papers
                  </Link>
                );
              })}
            </div>

            <div>
              <div className="ft-col-title">Platform</div>
              <Link to="/" className="ft-link">Home</Link>
              <Link to="/about" className="ft-link">About us</Link>
              <Link to="/dashboard" className="ft-link">Dashboard</Link>
              {isAuthenticated ? (
                <Link to="/dashboard" className="ft-link">My attempts</Link>
              ) : (
                <>
                  <Link to="/register" className="ft-link">Create account</Link>
                  <Link to="/login" className="ft-link">Log in</Link>
                </>
              )}
            </div>

            <div>
              <div className="ft-col-title">Legal</div>
              <Link to="/terms" className="ft-link">Terms &amp; Conditions</Link>
              <Link to="/privacy" className="ft-link">Privacy Policy</Link>
            </div>
          </div>

          <div className="ft-bottom">
            <p className="ft-copy">© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
            <p className="ft-disc">
              Independent practice platform. Not affiliated with UPSC, Indian Air Force, or the Indian Armed Forces.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
