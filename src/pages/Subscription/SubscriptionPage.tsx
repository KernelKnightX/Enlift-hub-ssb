import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CheckCircle,
  FileText,
  Mail,
  Calendar,
  Shield,
  Zap,
  ArrowRight,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { initializeMagazineSubscription, SUBSCRIPTION_PLANS, type PlanId } from '@/lib/magazinePaymentService';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('MONTHLY');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);

    try {
      await initializeMagazineSubscription(name, email, phone, selectedPlan);
    } catch (err) {
      console.error('Subscription error:', err);
      setError('Failed to initialize payment. Please try again.');
      setIsLoading(false);
    }
  };

  const faqs = [
    {
      q: 'How will I receive the magazine?',
      a: 'The daily PDF magazine will be sent directly to your registered email address whenever our admin uploads a new issue.',
    },
    {
      q: 'Can I cancel my subscription?',
      a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.',
    },
    {
      q: 'Is the payment secure?',
      a: 'Yes, all payments are processed securely through Razorpay, a trusted payment gateway used by millions of businesses in India.',
    },
    {
      q: 'What if I miss a day?',
      a: "Don't worry! All previous issues remain accessible. You can also contact our support if you need any specific past issues.",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --ink: #0D0D0D;
          --paper: #F5F0E8;
          --cream: #FAF7F2;
          --accent: #C8472B;
          --accent-dark: #A33520;
          --gold: #D4A853;
          --muted: #6B6355;
          --border: #D9D0C0;
        }

        .sub-page * { box-sizing: border-box; }

        .sub-page {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--ink);
        }

        /* ── HERO ── */
        .hero {
          background: var(--ink);
          color: var(--paper);
          padding: 6rem 1rem 5rem;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 79px,
            rgba(255,255,255,.04) 79px,
            rgba(255,255,255,.04) 80px
          );
          pointer-events: none;
        }
        .hero-inner {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
          position: relative;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          font-size: .75rem;
          font-weight: 600;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 2rem;
        }
        .hero-eyebrow svg { width: 14px; height: 14px; }
        .hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -.02em;
          margin: 0 0 1.5rem;
        }
        .hero-title em {
          font-style: italic;
          color: var(--gold);
        }
        .hero-sub {
          font-size: 1.05rem;
          font-weight: 300;
          color: rgba(245,240,232,.65);
          max-width: 560px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }
        .hero-pills {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: .6rem;
        }
        .pill {
          display: flex;
          align-items: center;
          gap: .4rem;
          padding: .4rem 1rem;
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 99px;
          font-size: .8rem;
          font-weight: 500;
          color: rgba(245,240,232,.75);
        }
        .pill svg { width: 13px; height: 13px; color: var(--gold); }

        /* ── SECTION SHARED ── */
        .section {
          padding: 5rem 1rem;
        }
        .section-inner {
          max-width: 1040px;
          margin: 0 auto;
        }
        .section-label {
          font-size: .7rem;
          font-weight: 600;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: .75rem;
        }
        .section-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 700;
          line-height: 1.15;
          color: var(--ink);
          margin: 0 0 1rem;
        }

        /* ── FEATURES ── */
        .features-bg {
          background: var(--paper);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2px;
          margin-top: 3.5rem;
          border: 2px solid var(--ink);
        }
        .feature-card {
          padding: 2.5rem 2rem;
          background: var(--paper);
          border-right: 2px solid var(--ink);
          transition: background .2s;
        }
        .feature-card:last-child { border-right: none; }
        .feature-card:hover { background: var(--cream); }
        .feature-icon {
          width: 44px;
          height: 44px;
          border: 2px solid var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .feature-icon svg { width: 20px; height: 20px; color: var(--ink); }
        .feature-card h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0 .6rem;
        }
        .feature-card p {
          font-size: .875rem;
          color: var(--muted);
          line-height: 1.65;
          margin: 0;
        }

        /* ── PRICING ── */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 3rem;
          max-width: 740px;
          margin-left: auto;
          margin-right: auto;
        }
        .plan-card {
          border: 2px solid var(--border);
          background: #fff;
          padding: 2.5rem 2rem;
          cursor: pointer;
          transition: border-color .2s, box-shadow .2s;
          position: relative;
        }
        .plan-card:hover {
          border-color: var(--ink);
        }
        .plan-card.selected {
          border-color: var(--ink);
          box-shadow: 6px 6px 0 var(--ink);
        }
        .plan-badge {
          position: absolute;
          top: -1px;
          right: 1.5rem;
          background: var(--accent);
          color: #fff;
          font-size: .65rem;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          padding: .25rem .75rem;
        }
        .plan-card h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0 0 .5rem;
        }
        .plan-price {
          margin: 1rem 0 1.5rem;
        }
        .plan-price .amount {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .plan-price .period {
          font-size: .85rem;
          color: var(--muted);
          margin-left: .2rem;
        }
        .plan-save {
          font-size: .8rem;
          color: var(--accent);
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .plan-features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
          display: flex;
          flex-direction: column;
          gap: .75rem;
        }
        .plan-features li {
          display: flex;
          align-items: flex-start;
          gap: .5rem;
          font-size: .875rem;
          color: var(--muted);
          line-height: 1.4;
        }
        .plan-features li svg { width: 16px; height: 16px; color: var(--accent); flex-shrink: 0; margin-top: 1px; }
        .plan-btn {
          width: 100%;
          padding: .85rem 1.5rem;
          font-size: .875rem;
          font-weight: 600;
          letter-spacing: .04em;
          cursor: pointer;
          border: 2px solid var(--ink);
          transition: background .15s, color .15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .4rem;
        }
        .plan-btn.active {
          background: var(--ink);
          color: var(--paper);
        }
        .plan-btn.inactive {
          background: transparent;
          color: var(--ink);
        }
        .plan-btn.inactive:hover {
          background: var(--ink);
          color: var(--paper);
        }

        /* ── FORM SECTION ── */
        .form-section {
          background: var(--ink);
          padding: 5rem 1rem;
        }
        .form-wrap {
          max-width: 520px;
          margin: 0 auto;
          background: var(--paper);
          padding: 3rem 2.5rem;
          border-top: 5px solid var(--accent);
        }
        .form-wrap h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 900;
          margin: 0 0 .4rem;
          color: var(--ink);
        }
        .form-wrap .form-sub {
          font-size: .875rem;
          color: var(--muted);
          margin: 0 0 2rem;
        }
        .field {
          margin-bottom: 1.25rem;
        }
        .field label {
          display: block;
          font-size: .78rem;
          font-weight: 600;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--ink);
          margin-bottom: .5rem;
        }
        .field input {
          width: 100%;
          border: 2px solid var(--border);
          background: #fff;
          padding: .7rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: .9rem;
          color: var(--ink);
          outline: none;
          transition: border-color .15s;
          border-radius: 0;
        }
        .field input:focus { border-color: var(--ink); }
        .field input::placeholder { color: #b0a898; }
        .field-hint {
          font-size: .75rem;
          color: var(--muted);
          margin-top: .35rem;
          display: flex;
          align-items: center;
          gap: .3rem;
        }
        .field-hint svg { width: 12px; height: 12px; }
        .form-error {
          background: #FEF0EE;
          border-left: 3px solid var(--accent);
          padding: .75rem 1rem;
          font-size: .85rem;
          color: var(--accent-dark);
          margin-bottom: 1rem;
        }
        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: var(--accent);
          color: #fff;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: .95rem;
          font-weight: 600;
          letter-spacing: .04em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .5rem;
          transition: background .15s;
          margin-top: 1.5rem;
        }
        .submit-btn:hover:not(:disabled) { background: var(--accent-dark); }
        .submit-btn:disabled { opacity: .65; cursor: not-allowed; }
        .submit-btn svg { width: 16px; height: 16px; }
        .form-legal {
          font-size: .72rem;
          color: var(--muted);
          text-align: center;
          margin-top: 1rem;
          line-height: 1.5;
        }
        .selected-plan-pill {
          display: inline-flex;
          align-items: center;
          gap: .35rem;
          background: var(--ink);
          color: var(--paper);
          font-size: .72rem;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          padding: .3rem .75rem;
          margin-bottom: 1.5rem;
        }

        /* ── FAQ ── */
        .faq-list {
          margin-top: 2.5rem;
          border-top: 2px solid var(--ink);
        }
        .faq-item {
          border-bottom: 1px solid var(--border);
        }
        .faq-q {
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          padding: 1.25rem 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--ink);
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .faq-q svg {
          width: 18px;
          height: 18px;
          color: var(--muted);
          flex-shrink: 0;
          transition: transform .25s;
        }
        .faq-q.open svg { transform: rotate(180deg); }
        .faq-a {
          max-height: 0;
          overflow: hidden;
          transition: max-height .3s ease, padding .3s;
          font-size: .9rem;
          color: var(--muted);
          line-height: 1.7;
        }
        .faq-a.open {
          max-height: 200px;
          padding-bottom: 1.25rem;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr; }
          .feature-card { border-right: none; border-bottom: 2px solid var(--ink); }
          .feature-card:last-child { border-bottom: none; }
          .form-wrap { padding: 2rem 1.25rem; }
        }
      `}</style>

      <div className="sub-page">
        <NavbarSection />
        <div style={{ height: '64px' }} />

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-eyebrow">
              <Zap />
              Daily Current Affairs
            </div>
            <h1 className="hero-title">
              The Magazine<br />
              <em>Built for Toppers</em>
            </h1>
            <p className="hero-sub">
              Daily PDF editions curated for UPSC, CDS, AFCAT, NDA and every
              defence competitive exam — delivered straight to your inbox.
            </p>
            <div className="hero-pills">
              {['Daily Updates', 'PDF Delivery', 'Exam Focused', 'Cancel Anytime'].map((t) => (
                <span key={t} className="pill">
                  <CheckCircle />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="section features-bg">
          <div className="section-inner">
            <div className="section-label">Why subscribe</div>
            <h2 className="section-title">Everything you need,<br />nothing you don't.</h2>

            <div className="features-grid">
              {[
                {
                  icon: <FileText />,
                  title: 'Daily PDF Delivery',
                  desc: 'A carefully curated PDF magazine lands in your inbox every morning before you begin studying.',
                },
                {
                  icon: <Calendar />,
                  title: 'Exam Oriented',
                  desc: 'Content shaped specifically for UPSC, CDS, AFCAT, NDA and all defence competitive exams.',
                },
                {
                  icon: <Shield />,
                  title: 'Trusted by Thousands',
                  desc: 'Join a community of serious aspirants who rely on our analysis to stay a step ahead.',
                },
              ].map((f) => (
                <div key={f.title} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="section">
          <div className="section-inner" style={{ textAlign: 'center' }}>
            <div className="section-label">Pricing</div>
            <h2 className="section-title">Pick your plan</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 0, fontSize: '.95rem' }}>
              Simple, transparent pricing. No hidden fees.
            </p>

            <div className="pricing-grid">
              {/* Monthly */}
              <div
                className={`plan-card ${selectedPlan === 'MONTHLY' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('MONTHLY')}
              >
                <h3>{SUBSCRIPTION_PLANS.MONTHLY.name}</h3>
                <div className="plan-price">
                  <span className="amount">₹{SUBSCRIPTION_PLANS.MONTHLY.price}</span>
                  <span className="period">/month</span>
                </div>
                <ul className="plan-features">
                  {SUBSCRIPTION_PLANS.MONTHLY.features.map((f, i) => (
                    <li key={i}><CheckCircle />{f}</li>
                  ))}
                </ul>
                <button
                  className={`plan-btn ${selectedPlan === 'MONTHLY' ? 'active' : 'inactive'}`}
                  onClick={() => setSelectedPlan('MONTHLY')}
                >
                  {selectedPlan === 'MONTHLY' ? '✓ Selected' : 'Select Plan'}
                </button>
              </div>

              {/* Yearly */}
              <div
                className={`plan-card ${selectedPlan === 'YEARLY' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('YEARLY')}
              >
                <span className="plan-badge">Best Value</span>
                <h3>{SUBSCRIPTION_PLANS.YEARLY.name}</h3>
                <div className="plan-price">
                  <span className="amount">₹{SUBSCRIPTION_PLANS.YEARLY.price}</span>
                  <span className="period">/year</span>
                </div>
                <p className="plan-save">You save ₹1,089 vs monthly</p>
                <ul className="plan-features">
                  {SUBSCRIPTION_PLANS.YEARLY.features.map((f, i) => (
                    <li key={i}><CheckCircle />{f}</li>
                  ))}
                </ul>
                <button
                  className={`plan-btn ${selectedPlan === 'YEARLY' ? 'active' : 'inactive'}`}
                  onClick={() => setSelectedPlan('YEARLY')}
                >
                  {selectedPlan === 'YEARLY' ? '✓ Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FORM ── */}
        <section className="form-section">
          <div className="form-wrap">
            <div className="selected-plan-pill">
              <Zap style={{ width: 11, height: 11 }} />
              {selectedPlan === 'MONTHLY' ? 'Monthly Plan' : 'Yearly Plan'} selected
            </div>
            <h2>Subscribe Now</h2>
            <p className="form-sub">
              {selectedPlan === 'MONTHLY'
                ? 'Start with a free trial — cancel anytime.'
                : 'Best value plan — free trial included.'}
            </p>

            <form onSubmit={handleSubscribe}>
              <div className="field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="field-hint">
                  <Mail />
                  Magazine will be sent to this email
                </div>
              </div>

              <div className="field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  required
                />
              </div>

              {error && <div className="form-error">{error}</div>}

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} /> Processing…</>
                ) : (
                  <>Subscribe Free <ArrowRight /></>
                )}
              </button>

              <p className="form-legal">
                By subscribing you agree to our Terms of Service and Privacy Policy.
                Payments processed securely via Razorpay.
              </p>
            </form>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="section">
          <div className="section-inner" style={{ maxWidth: 680 }}>
            <div className="section-label">FAQ</div>
            <h2 className="section-title">Got questions?</h2>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item">
                  <button
                    className={`faq-q ${openFaq === i ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {faq.q}
                    <ChevronDown />
                  </button>
                  <div className={`faq-a ${openFaq === i ? 'open' : ''}`}>{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FooterSection />
      </div>
    </>
  );
}