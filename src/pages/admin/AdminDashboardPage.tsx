import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  BarChart3,
  Clock,
  Database,
  FileText,
  Settings,
  Shield,
  Upload,
  Users,
} from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { getMockTests } from '@/lib/mockTestService';
import type { MockTest } from '@/types/schema';

const TRACK_EXAMS = ['CDS', 'AFCAT'] as const;

export default function AdminDashboardPage() {
  const [now, setNow] = useState(new Date());
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getMockTests()
      .then(setTests)
      .catch((err) => console.error('Admin dashboard: failed to load tests', err))
      .finally(() => setLoading(false));
  }, []);

  const published = tests.filter((t) => t.isPublished);
  const totalQuestions = tests.reduce((n, t) => n + (t.questions?.length ?? t.totalQuestions ?? 0), 0);

  const trackCounts = useMemo(() => {
    const counts: Record<string, number> = { CDS: 0, AFCAT: 0 };
    tests.forEach((t) => {
      const key = t.examName?.toUpperCase();
      if (key && key in counts) counts[key] += 1;
    });
    return counts;
  }, [tests]);

  const subjectBuckets = useMemo(() => {
    const map = new Map<string, number>();
    tests.forEach((test) => {
      test.questions?.forEach((q) => {
        const sub = (q.subject || test.subject || 'General').trim();
        map.set(sub, (map.get(sub) ?? 0) + 1);
      });
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [tests]);

  const systemTime = now.toLocaleString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <AdminShell>
      <section className="adm-welcome">
        <div>
          <h2>
            Welcome, Administrator
            <span className="adm-pill-gold">Admin</span>
          </h2>
          <p>
            Manage CDS and AFCAT mock test content, question rosters, and evaluation metrics from one
            secure control panel.
          </p>
          <div className="adm-meta-row">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Clock size={14} />
              {systemTime} (IST)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              Server online
            </span>
          </div>
        </div>
        <div className="adm-kpi-row">
          <div className="adm-kpi">
            <div className="adm-kpi-val">{loading ? '—' : tests.length}</div>
            <div className="adm-kpi-label">Active papers</div>
            {!loading && published.length > 0 && (
              <div className="adm-kpi-tag">+ {published.length} published</div>
            )}
          </div>
          <div className="adm-kpi">
            <div className="adm-kpi-val">{loading ? '—' : totalQuestions.toLocaleString('en-IN')}</div>
            <div className="adm-kpi-label">Questions in bank</div>
          </div>
          <div className="adm-kpi">
            <div className="adm-kpi-val">{loading ? '—' : TRACK_EXAMS.length}</div>
            <div className="adm-kpi-label">Exam tracks</div>
          </div>
        </div>
      </section>

      <div className="adm-section-head">
        <FileText size={14} />
        Test content management
      </div>

      <div className="adm-mgmt-grid">
        <div className="adm-hero-card">
          <h3>CDS · AFCAT <span className="text-sm font-semibold text-slate-500">(NDA coming soon)</span></h3>
          <p>
            Upload, configure, and manage standard MCQ mock test papers, negative marking schemes, and answer
            justifications. Import spreadsheets with embedded <strong>image_data</strong> (base64) or ZIP bundles
            (CSV + PNG files via <strong>image_file</strong>).
          </p>
          <div className="adm-track-pills">
            {TRACK_EXAMS.map((exam) => (
              <span key={exam} className="adm-track-pill">
                {exam} track ({loading ? '…' : trackCounts[exam]} sets)
              </span>
            ))}
          </div>
          <div className="adm-hero-actions">
            <Link to="/admin/mock" className="btn btn-teal">
              <Upload size={15} />
              Manage mock tests
            </Link>
            <Link to="/admin/mock?import=1" className="btn btn-outline">
              Import CSV / ZIP
            </Link>
          </div>
        </div>

        <aside className="adm-side-card">
          <h4>
            Question bank repository
            <span className="adm-sync">Synced</span>
          </h4>
          <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Curated defence exam items across papers</p>
          <div className="adm-side-total">{loading ? '—' : totalQuestions.toLocaleString('en-IN')}</div>
          <ul className="adm-side-list">
            {loading ? (
              <li><span>Loading…</span></li>
            ) : subjectBuckets.length === 0 ? (
              <li><span>No questions yet</span><span>0</span></li>
            ) : (
              subjectBuckets.map(([name, count]) => (
                <li key={name}>
                  <span>{name}</span>
                  <strong>{count} Qs</strong>
                </li>
              ))
            )}
          </ul>
          <Link to="/admin/mock" className="adm-side-link">
            Open mock test manager <ArrowRight size={14} />
          </Link>
        </aside>
      </div>

      <div className="adm-section-head">
        <BarChart3 size={14} />
        System &amp; analytics
      </div>

      <div className="adm-sys-grid">
        <div className="adm-sys-card">
          <Users size={20} color="#64748b" />
          <h4>User management</h4>
          <p>Roles, access &amp; history</p>
          <div className="adm-sys-stat">Coming soon</div>
        </div>
        <div className="adm-sys-card">
          <BarChart3 size={20} color="#64748b" />
          <h4>Performance analytics</h4>
          <p>Attempts &amp; trends</p>
          <div className="adm-sys-stat">Coming soon</div>
        </div>
        <div className="adm-sys-card">
          <Settings size={20} color="#64748b" />
          <h4>System settings</h4>
          <p>Platform configuration</p>
          <div className="adm-sys-stat">Exam mode: active</div>
        </div>
        <div className="adm-sys-card">
          <Shield size={20} color="#64748b" />
          <h4>Audit &amp; security</h4>
          <p>Import integrity checks</p>
          <div className="adm-sys-stat">CSV / ZIP validation on</div>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#94a3b8' }}>
        <Database size={14} />
        {loading ? 'Connecting to question store…' : `${tests.length} papers · ${totalQuestions} questions indexed`}
      </div>
    </AdminShell>
  );
}
