import { Link } from 'react-router';
import { Shield } from 'lucide-react';

const footerLinks = {
  platform: [
    { label: 'Home', path: '/' },
    { label: 'About SSB', path: '/ssb-info' },
    { label: 'SSB Process', path: '/ssb-process' },
    { label: 'Practice Tests', path: '/register' },
    { label: 'Current Affairs', path: '/subscription' },
  ],
  preparation: [
    { label: 'PPDT', path: '/ppdt/instructions' },
    { label: 'TAT', path: '/tat/instructions' },
    { label: 'WAT', path: '/wat/instructions' },
    { label: 'SRT', path: '/srt/instructions' },
  ],
  support: [
    { label: 'Login', path: '/login' },
    { label: 'Register', path: '/register' },
    { label: 'Mentorship', path: '/mentorship' },
    { label: 'Terms', path: '/terms' },
  ],
};

export function FooterSection() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-slate-700" />
              <span className="text-lg font-semibold text-slate-900">Enlift hub</span>
            </Link>
            <p className="text-sm text-slate-500">
              Structured practice for SSB psychology tests.
            </p>
            <p className="text-xs text-slate-400 mt-4">
              Train the Mind. Clear the Board.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.label.toLowerCase().replace(/\s+/g, '-')}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Preparation Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Tests</h4>
            <ul className="space-y-2">
              {footerLinks.preparation.map((link) => (
                <li key={link.label.toLowerCase().replace(/\s+/g, '-')}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label.toLowerCase().replace(/\s+/g, '-')}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Enlift hub. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            This is a practice platform. Not affiliated with Indian Armed Forces.
          </p>
        </div>
      </div>
    </footer>
  );
}
