import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';
import { WhatsAppFloatButton } from '@/components/WhatsAppFloatButton';
import { ArrowRight, Check } from 'lucide-react';

// ─── SEO STRUCTURED DATA ─────────────────────────────────────────────────────

const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Enlift Hub",
  description: "India's focused SSB preparation platform offering elite classroom training, online mentorship, and digital psychology practice for Indian Armed Forces officer aspirants.",
  url: "https://enlifthub.com/mentorship",
  offers: [
    {
      "@type": "Offer",
      name: "Elite Classroom Program",
      description: "Intensive on-ground SSB preparation for a selective batch of 10 candidates under ex-defence officers.",
      price: "24999",
      priceCurrency: "INR",
    },
    {
      "@type": "Offer",
      name: "Online SSB Mentorship",
      description: "Structured online SSB mentorship with daily 4-hour live sessions for a batch of 20 aspirants.",
      price: "9999",
      priceCurrency: "INR",
    },
    {
      "@type": "Offer",
      name: "Digital Psychology Practice Platform",
      description: "Unlimited TAT, WAT, SRT and PPDT practice under real SSB timing. Free for all registered candidates.",
      price: "1999",
      priceCurrency: "INR",
    },
  ],
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

const programs = [
  {
    id: 'classroom',
    tag: 'Offline · Selective',
    tagColor: '#C8A84B',
    label: '01',
    title: 'Elite Classroom Program',
    pitch: 'Ten candidates. One room. No shortcuts.',
    desc: `Our classroom program is built for candidates who are serious enough to earn their seat. Admission is granted only after clearing the Enlift Hub Entrance Assessment — ensuring every participant in the batch is capable and committed.\n\nSelected candidates undergo intensive on-ground preparation: full SSB simulations, GTO ground training, psychology test labs, and mock interview panels — all conducted under ex-defence officers who have sat on the board. You don't just learn about the SSB. You live it for 30 days.`,
    details: ['Batch of 10 — no exceptions', 'Entrance assessment required', 'Full SSB simulation environment', 'GTO ground training with ex-officers', 'Psychology test labs — TAT, WAT, SRT, PPDT', 'Mock interview panels & PIQ deep-dive', 'OLQ-focused personality development', 'Daily debrief and personal feedback'],
    duration: '30 Days',
    mode: 'Offline · Residential',
    price: '₹24,999',
    seats: '10 seats per batch',
    cta: 'Apply for Assessment',
    route: '/register',
  },
  {
    id: 'online',
    tag: 'Live · Online',
    tagColor: '#4ade80',
    label: '02',
    title: 'Online SSB Mentorship',
    pitch: 'Structured preparation. From anywhere.',
    desc: `For candidates who cannot relocate, Enlift Hub delivers a full SSB preparation experience online — without compromising on rigour. Admission requires clearing the Enlift Hub Pre-Assessment, after which selected candidates join a disciplined batch of 20 aspirants.\n\nThe program runs 4 hours daily — live, not recorded. Sessions cover psychology walkthroughs, structured preparation modules, GTO planning strategies, and interview preparation. Mentors are reachable outside sessions for doubt-clearing and personalised feedback.`,
    details: ['Batch of 20 — pre-assessed entry', '4 hours of live daily mentorship', 'Psychology test walkthroughs & practice', 'GTO strategy and planning exercises', 'Interview preparation & PIQ guidance', 'Personalised feedback on all submissions', 'WhatsApp mentor access between sessions', 'Mock SSB days with group simulation'],
    duration: '15 Days',
    mode: 'Live Online',
    price: '₹9,999',
    seats: '20 seats per batch',
    cta: 'Apply for Pre-Assessment',
    route: '/register',
  },
  {
    id: 'digital',
    tag: 'Digital · Self-Paced',
    tagColor: '#60a5fa',
    label: '03',
    title: 'Digital Psych Practice',
    pitch: 'Your psychology. Practiced before you walk in.',
    desc: `The psychology stage is where most candidates are caught unprepared — not because they lack intelligence, but because they have never written under real SSB timing before. Enlift Hub's practice platform fixes exactly that.\n\nPractice PPDT, TAT, WAT, and SRT under conditions that mirror the actual SSB: enforced timers, no pausing, no editing mid-attempt. With 150+ unique question sets and unlimited attempts, you can practice daily, track your improvement, and arrive at the board having already done this hundreds of times.`,
    details: ['Real SSB timing enforced — no pause, no edit', '150+ unique psychology question sets', 'All 4 tests: PPDT, TAT, WAT, SRT', 'Unlimited attempts — practice as often as needed', 'AI-assisted feedback on responses', 'Structured guidance per test type', 'Track improvement across attempts', 'Access from any device, any time'],
    duration: 'Unlimited Access',
    mode: 'Self-Paced · Digital',
    price: '₹1,999',
    seats: 'Open access',
    cta: 'Start Practising',
    route: '/register',
  },
];

const platformTests = [
  {
    stage: 'Stage I',
    code: 'PPDT',
    name: 'Picture Perception & Discussion Test',
    desc: 'A hazy image. 30 seconds to observe. 4 minutes to write a story. Then narrate and discuss with others under timed conditions.',
    timing: '30 sec view · 4 min story · Group discussion',
  },
  {
    stage: 'Stage II',
    code: 'TAT',
    name: 'Thematic Apperception Test',
    desc: '12 images in 48 minutes. Your stories reveal recurring themes — initiative, responsibility, optimism — that the psychologist reads across the full set.',
    timing: '12 images · 4 min each',
  },
  {
    stage: 'Stage II',
    code: 'WAT',
    name: 'Word Association Test',
    desc: '60 words. 15 seconds per word. The first sentence your mind produces. There are no correct answers — only natural ones.',
    timing: '60 words · 15 sec each',
  },
  {
    stage: 'Stage II',
    code: 'SRT',
    name: 'Situation Reaction Test',
    desc: '60 everyday situations. 30 minutes total. How you instinctively react under pressure reveals practical judgment and sense of responsibility.',
    timing: '60 situations · 30 min total',
  },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mp {
    min-height: 100vh;
    background: #ffffff;
    color: #1a1a1a;
    font-family: Georgia, 'Times New Roman', serif;
  }

  /* ── HERO ── */
  .mp-hero {
    background: linear-gradient(135deg, #ffffff 16%, #e8e5df 50%, #ffffff 100%);
    padding: 100px 48px 80px;
    position: relative;
    overflow: hidden;
  }
  .mp-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 60% 50%, rgba(200,168,75,0.12), transparent);
    pointer-events: none;
  }

  .mp-hero-inner { max-width: 1400px; margin: 0 auto; }
  .mp-hero-eyebrow {
    font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
    color: #b28e23; font-family: system-ui; margin-bottom: 28px;
  }
  .mp-hero-h1 {
    font-size: clamp(2.2rem, 5vw, 4rem);
    font-weight: 400; line-height: 1.08; letter-spacing: -0.03em;
    color: #000000; margin-bottom: 32px; max-width: 100%;
  }
  .mp-hero-h1 em { font-style: italic; color: #C8A84B; }
  .mp-hero-sub {
    font-size: 1.1rem; line-height: 1.85; color: rgba(0, 0, 0, 0.6)
    max-width: 1880px; font-style: italic;
  }
  .mp-hero-rule {
    width: 250px; height: 2px; background: #C8A84B;
    margin: 36px 0;
  }
  .mp-hero-meta {
    display: flex; gap: 40px; flex-wrap: wrap;
  }
  .mp-hero-stat-v {
    font-size: 1.8rem; font-weight: 300; color: #030303;
    letter-spacing: -0.02em; margin-bottom: 4px;
  }
  .mp-hero-stat-l {
    font-size: 11px; color: rgb(25, 29, 35);
    letter-spacing: 0.1em; text-transform: uppercase; font-family: system-ui;
  }

  /* ── INTRO BAND ── */
  .mp-intro {
    background: #101e17;
    padding: 56px 48px;
  }
  .mp-intro-inner {
    max-width: 1400px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
  }
  .mp-intro-h {
    font-size: 1.7rem; font-weight: 400; color: #fff;
    line-height: 1.2; letter-spacing: -0.01em; margin-bottom: 16px;
  }
  .mp-intro-h em { font-style: italic; color: #C8A84B; }
  .mp-intro-p {
    font-size: 0.95rem; line-height: 1.85; color: rgba(255,255,255,0.5);
  }
  .mp-intro-paths { display: flex; flex-direction: column; gap: 16px; }
  .mp-intro-path {
    display: flex; align-items: center; gap: 20px;
    padding: 18px 20px; border: 1px solid rgba(255,255,255,0.08);
    cursor: pointer; transition: border-color 0.2s;
  }
  .mp-intro-path:hover { border-color: rgba(200,168,75,0.4); }
  .mp-intro-path-num {
    font-size: 11px; color: rgba(255,255,255,0.25);
    font-family: system-ui; letter-spacing: 0.08em; flex-shrink: 0;
  }
  .mp-intro-path-title {
    font-size: 0.9rem; font-weight: 600; color: #fff; margin-bottom: 3px;
  }
  .mp-intro-path-sub {
    font-size: 12px; color: rgba(255,255,255,0.35); font-family: system-ui;
  }
  .mp-intro-path-arrow { margin-left: auto; color: rgba(255,255,255,0.2); flex-shrink: 0; }

  /* ── MAIN ── */
  .mp-main { max-width: 1400px; margin: 0 auto; padding: 0 48px; }

  /* ── PROGRAMS ── */
  .mp-programs { padding: 96px 0 0; }
  .mp-prog-lbl {
    font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
    color: #888; font-family: system-ui; margin-bottom: 14px;
  }
  .mp-prog-heading {
    font-size: 2rem; font-weight: 400; letter-spacing: -0.02em;
    margin-bottom: 72px;
  }

  /* ── SINGLE PROGRAM ── */
  .mp-prog { padding: 64px 0; border-top: 1px solid #e0ddd8; }
  .mp-prog-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }

  .mp-prog-left {}
  .mp-prog-num {
    font-size: 4rem; font-weight: 300; color: #e8e5e0;
    line-height: 1; letter-spacing: -0.04em; margin-bottom: 20px;
    font-family: Georgia, serif;
  }
  .mp-prog-tag {
    font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    font-family: system-ui; margin-bottom: 14px;
  }
  .mp-prog-title {
    font-size: 1.6rem; font-weight: 400; letter-spacing: -0.01em;
    margin-bottom: 10px;
  }
  .mp-prog-pitch {
    font-size: 1rem; font-style: italic; color: #666; margin-bottom: 28px;
  }
  .mp-prog-desc {
    font-size: 0.975rem; line-height: 1.9; color: #333; margin-bottom: 14px;
  }
  .mp-prog-desc:last-of-type { margin-bottom: 0; }

  .mp-prog-right {}
  .mp-prog-meta {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
    background: #e0ddd8; margin-bottom: 36px;
  }
  .mp-prog-meta-item { background: #fafaf8; padding: 16px 18px; }
  .mp-prog-meta-l {
    font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
    color: #aaa; font-family: system-ui; margin-bottom: 4px;
  }
  .mp-prog-meta-v {
    font-size: 0.9rem; font-weight: 500; color: #1a1a1a;
  }
  .mp-prog-features { margin-bottom: 36px; }
  .mp-prog-feat {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 11px 0; border-bottom: 1px solid #f0ede8;
    font-size: 0.875rem; color: #333; line-height: 1.5;
  }
  .mp-prog-feat:last-child { border-bottom: none; }
  .mp-prog-feat svg { color: #C8A84B; flex-shrink: 0; margin-top: 1px; }
  .mp-prog-price-row {
    display: flex; align-items: baseline; justify-content: space-between;
    padding: 20px 0; border-top: 1px solid #e0ddd8; margin-bottom: 20px;
  }
  .mp-prog-price {
    font-size: 2rem; font-weight: 300; letter-spacing: -0.02em; color: #1a1a1a;
  }
  .mp-prog-seats {
    font-size: 12px; color: #888; font-family: system-ui;
  }
  .mp-prog-btn {
    width: 100%; padding: 15px 24px;
    background: #1a1a1a; color: #fff;
    border: none; cursor: pointer;
    font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase;
    font-family: system-ui; font-weight: 600;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: background 0.2s;
  }
  .mp-prog-btn:hover { background: #C8A84B; color: #0d1710; }
  .mp-prog-btn.highlight { background: #C8A84B; color: #0d1710; }
  .mp-prog-btn.highlight:hover { background: #b8973f; }

  /* ── PLATFORM SECTION ── */
  .mp-platform { padding: 96px 0 80px; }
  .mp-platform-top {
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
    padding-bottom: 64px; border-bottom: 1px solid #e0ddd8; margin-bottom: 64px;
    align-items: start;
  }
  .mp-platform-h { font-size: 2rem; font-weight: 400; letter-spacing: -0.02em; margin-bottom: 20px; }
  .mp-platform-h em { font-style: italic; color: #888; }
  .mp-platform-p { font-size: 0.975rem; line-height: 1.9; color: #333; margin-bottom: 16px; }
  .mp-platform-feats { display: flex; flex-direction: column; gap: 0; }
  .mp-platform-feat {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 14px 0; border-bottom: 1px solid #f0ede8;
    font-size: 0.875rem; color: #333;
  }
  .mp-platform-feat:last-child { border-bottom: none; }
  .mp-platform-feat svg { color: #C8A84B; flex-shrink: 0; margin-top: 2px; }

  /* ── TESTS GRID ── */
  .mp-tests-h {
    font-size: 1.1rem; font-weight: 400; letter-spacing: -0.01em;
    margin-bottom: 32px; color: #555; font-style: italic;
  }
  .mp-tests-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: #e0ddd8; }
  .mp-test-item { background: #fafaf8; padding: 36px 32px; }
  .mp-test-stage {
    font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
    color: #aaa; font-family: system-ui; margin-bottom: 6px;
  }
  .mp-test-code {
    font-size: 1.4rem; font-weight: 400; letter-spacing: -0.01em;
    margin-bottom: 6px;
  }
  .mp-test-name {
    font-size: 12px; color: #888; font-family: system-ui; margin-bottom: 18px;
  }
  .mp-test-desc { font-size: 0.875rem; line-height: 1.75; color: #444; margin-bottom: 14px; }
  .mp-test-timing {
    font-size: 11px; color: #C8A84B; font-family: system-ui;
    letter-spacing: 0.06em; border-left: 2px solid #C8A84B; padding-left: 10px;
  }

  /* ── WHY ENLIFT ── */
  .mp-why { background: #1a1a1a; padding: 96px 48px; margin-top: 0; }
  .mp-why-inner { max-width: 1400px; margin: 0 auto; }
  .mp-why-lbl {
    font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
    color: #C8A84B; font-family: system-ui; margin-bottom: 14px;
  }
  .mp-why-h {
    font-size: 2rem; font-weight: 400; color: #fff;
    letter-spacing: -0.02em; margin-bottom: 64px; max-width: 600px;
  }
  .mp-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #333; }
  .mp-why-item { background: #1a1a1a; padding: 40px 32px; }
  .mp-why-num {
    font-size: 2.5rem; font-weight: 300; color: rgba(200,168,75,0.25);
    letter-spacing: -0.04em; margin-bottom: 16px; font-family: Georgia;
  }
  .mp-why-title { font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 10px; }
  .mp-why-desc { font-size: 0.875rem; line-height: 1.75; color: rgba(255,255,255,0.45); }

  /* ── FINAL CTA ── */
  .mp-cta { padding: 96px 48px; background: #fafaf8; }
  .mp-cta-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: flex-end;
    gap: 48px; flex-wrap: wrap;
    padding-top: 64px; border-top: 1px solid #e0ddd8;
  }
  .mp-cta-h {
    font-size: clamp(1.5rem, 3vw, 2.4rem); font-weight: 400;
    letter-spacing: -0.02em; line-height: 1.15; max-width: 540px;
  }
  .mp-cta-h em { font-style: italic; color: #888; }
  .mp-cta-right { display: flex; flex-direction: column; gap: 12px; flex-shrink: 0; }
  .mp-cta-btn-primary {
    padding: 15px 32px; background: #1a1a1a; color: #fff;
    border: none; cursor: pointer; font-size: 13px;
    letter-spacing: 0.06em; text-transform: uppercase;
    font-family: system-ui; font-weight: 600;
    display: flex; align-items: center; gap: 10px; transition: background 0.2s;
  }
  .mp-cta-btn-primary:hover { background: #C8A84B; color: #0d1710; }
  .mp-cta-note { font-size: 12px; color: #aaa; font-family: system-ui; text-align: right; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1000px) {
    .mp-prog-inner { grid-template-columns: 1fr; gap: 48px; }
    .mp-platform-top { grid-template-columns: 1fr; gap: 48px; }
    .mp-intro-inner { grid-template-columns: 1fr; gap: 48px; }
  }

  @media (max-width: 760px) {
    .mp-hero { padding: 80px 24px 64px; }
    .mp-intro { padding: 48px 24px; }
    .mp-main { padding: 0 24px; }
    .mp-why { padding: 72px 24px; }
    .mp-cta { padding: 64px 24px; }
    .mp-tests-grid { grid-template-columns: 1fr; }
    .mp-why-grid { grid-template-columns: 1fr; }
    .mp-cta-inner { flex-direction: column; align-items: flex-start; }
    .mp-cta-note { text-align: left; }
    .mp-hero-meta { gap: 28px; }
  }

  @media (max-width: 520px) {
    .mp-hero { padding: 64px 16px 56px; }
    .mp-main { padding: 0 16px; }
    .mp-why { padding: 56px 16px; }
    .mp-cta { padding: 48px 16px; }
    .mp-hero-h1 { font-size: 2rem; }
    .mp-prog-num { font-size: 3rem; }
    .mp-prog-meta { grid-template-columns: 1fr; }
  }
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function MentorshipPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'SSB Mentorship & Training Programs | Enlift Hub';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Three paths to SSB selection: Elite classroom training for 10 candidates, live online mentorship for 20, and a free digital psychology practice platform. Enlift Hub — built for serious SSB aspirants.');
    }
  }, []);

  return (
    <div className="mp">
      <style>{css}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <NavbarSection />

      {/* ── HERO ── */}
      <header className="mp-hero">
        <div className="mp-hero-inner">
          <div className="mp-hero-eyebrow">Enlift Hub · SSB Preparation</div>
          <h1 className="mp-hero-h1">
            Three paths, 
            One destination.<br />
            <em>Your commission.</em>
          </h1>
          <div className="mp-hero-rule" />
          <p className="mp-hero-sub">
            Whether you need the intensity of a residential programme, the structure of live online mentorship, or simply a place to practice your psychology tests — Enlift Hub has a pathway built for you.
          </p>
          <div className="mp-hero-meta" style={{ marginTop: '28px' }}>
            {[['10', 'Classroom seats per batch'], ['20', 'Online batch strength'], ['150+', 'Psychology question sets'], ['4 hrs', 'Daily live mentorship']].map(([v, l]) => (
              <div key={v}>
                <div className="mp-hero-stat-v">{v}</div>
                <div className="mp-hero-stat-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── INTRO BAND ── */}
      <div className="mp-intro">
        <div className="mp-intro-inner">
          <div>
            <div className="mp-intro-h">
              What <em>Enlift Hub</em> offers
            </div>
            <p className="mp-intro-p">
              Most SSB preparation focuses on what to do. Enlift Hub focuses on who to become. Every programme — classroom, online, or digital — is designed around one question: does this candidate have what the board actually looks for?
            </p>
          </div>
          <div className="mp-intro-paths">
            {programs.map((p) => (
              <div className="mp-intro-path" key={p.id} onClick={() => document.getElementById(p.id)?.scrollIntoView({ behavior: 'smooth' })}>
                <div className="mp-intro-path-num">{p.label}</div>
                <div>
                  <div className="mp-intro-path-title">{p.title}</div>
                  <div className="mp-intro-path-sub">{p.tag}</div>
                </div>
                <ArrowRight size={16} className="mp-intro-path-arrow" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="mp-main">

        {/* ── PROGRAMS ── */}
        <section className="mp-programs" aria-label="Enlift Hub SSB programs">
          <div className="mp-prog-lbl">Programmes</div>
          <h2 className="mp-prog-heading">Choose your preparation path</h2>

          {programs.map((prog, pi) => (
            <div className="mp-prog" id={prog.id} key={prog.id}>
              <div className="mp-prog-inner">

                {/* LEFT — story */}
                <div className="mp-prog-left">
                  <div className="mp-prog-num">{prog.label}</div>
                  <div className="mp-prog-tag" style={{ color: prog.tagColor }}>{prog.tag}</div>
                  <h3 className="mp-prog-title">{prog.title}</h3>
                  <p className="mp-prog-pitch">{prog.pitch}</p>
                  {prog.desc.split('\n\n').map((para, i) => (
                    <p className="mp-prog-desc" key={i}>{para}</p>
                  ))}
                </div>

                {/* RIGHT — details + CTA */}
                <div className="mp-prog-right">
                  <div className="mp-prog-meta">
                    <div className="mp-prog-meta-item">
                      <div className="mp-prog-meta-l">Duration</div>
                      <div className="mp-prog-meta-v">{prog.duration}</div>
                    </div>
                    <div className="mp-prog-meta-item">
                      <div className="mp-prog-meta-l">Mode</div>
                      <div className="mp-prog-meta-v">{prog.mode}</div>
                    </div>
                  </div>

                  <div className="mp-prog-features">
                    {prog.details.map((d, i) => (
                      <div className="mp-prog-feat" key={i}>
                        <Check size={15} />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mp-prog-price-row">
                    <div className="mp-prog-price">{prog.price}</div>
                    <div className="mp-prog-seats">{prog.seats}</div>
                  </div>

                  <button
                    className={`mp-prog-btn${pi === 1 ? ' highlight' : ''}`}
                    onClick={() => navigate(prog.route)}
                  >
                    {prog.cta} <ArrowRight size={16} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </section>

        {/* ── PLATFORM DEEP-DIVE ── */}
        <section className="mp-platform" aria-label="Digital psychology practice platform">
          <div className="mp-prog-lbl">Platform</div>

          <div className="mp-platform-top">
            <div>
              <h2 className="mp-platform-h">
                Your psychology tests.<br />
                <em>Practiced before you walk in.</em>
              </h2>
              <p className="mp-platform-p">
                The psychology stage is where most candidates are caught unprepared — not because they lack intelligence, but because they have never written under real SSB timing before. By the time you arrive at the board, the 15-second WAT window should feel familiar, not alarming.
              </p>
              <p className="mp-platform-p">
                Enlift Hub's practice platform enforces the exact same constraints as the actual test: no pausing, no editing, no extra time. 150+ unique question sets ensure you never repeat the same stimulus twice. Access is free for all registered candidates.
              </p>
            </div>
            <div>
              <div className="mp-platform-feats">
                {[
                  'Real SSB timing enforced — no pause, no edit mid-attempt',
                  '150+ unique psychology question sets across all 4 tests',
                  'Unlimited attempts — practice as often as needed',
                  'PPDT, TAT, WAT and SRT all in one place',
                  'AI-assisted feedback on written responses',
                  'Track improvement across attempts over time',
                  'Access from any device — mobile, tablet, desktop',
                  'Free for all registered Enlift Hub candidates',
                ].map((f, i) => (
                  <div className="mp-platform-feat" key={i}>
                    <Check size={15} style={{ color: '#C8A84B', flexShrink: 0, marginTop: 2 }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mp-tests-h">The four tests you will practice</div>
          <div className="mp-tests-grid">
            {platformTests.map((t, i) => (
              <div className="mp-test-item" key={i}>
                <div className="mp-test-stage">{t.stage}</div>
                <div className="mp-test-code">{t.code}</div>
                <div className="mp-test-name">{t.name}</div>
                <p className="mp-test-desc">{t.desc}</p>
                <div className="mp-test-timing">{t.timing}</div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ── WHY ENLIFT ── */}
      <section className="mp-why" aria-label="Why Enlift Hub">
        <div className="mp-why-inner">
          <div className="mp-why-lbl">Why Enlift Hub</div>
          <h2 className="mp-why-h">Built differently. Because the SSB tests differently.</h2>
          <div className="mp-why-grid">
            {[
              { num: '01', title: 'Entry is earned, not bought', desc: 'Both the classroom and online programmes require clearing an Enlift Hub assessment before admission. Every candidate in your batch is serious and capable — no passengers.' },
              { num: '02', title: 'Mentored by those who\'ve sat on the board', desc: 'Classroom faculty are ex-defence officers with direct SSB experience. Online mentors are carefully selected for depth — not just familiarity with the tests.' },
              { num: '03', title: 'Small batches. Real feedback.', desc: 'Ten candidates in the classroom. Twenty online. These numbers are not marketing — they are the only way personal feedback and genuine mentorship are possible.' },
              { num: '04', title: 'OLQ-first preparation', desc: 'Every session, every task, every feedback note is anchored in the 15 Officer-Like Qualities. We do not teach you to pass tests. We help you develop the qualities that pass tests.' },
              { num: '05', title: 'Practice that mirrors reality', desc: 'The psychology platform enforces real SSB timing. The GTO simulations use real props and structured tasks. Candidates who have done this before have an edge over those who have only read about it.' },
              { num: '06', title: 'No guaranteed results claims', desc: 'SSB selection is based on who you are, not which coaching you attended. Enlift Hub\'s role is to help you become the best version of yourself before you walk in. The rest is yours.' },
            ].map((w) => (
              <div className="mp-why-item" key={w.num}>
                <div className="mp-why-num">{w.num}</div>
                <div className="mp-why-title">{w.title}</div>
                <p className="mp-why-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <div className="mp-cta">
        <div className="mp-cta-inner">
          <h2 className="mp-cta-h">
            The board observes five days.<br />
            <em>Preparation takes months.</em><br />
            Start now.
          </h2>
          <div className="mp-cta-right">
            <button className="mp-cta-btn-primary" onClick={() => navigate('/register')}>
              Register on Enlift Hub <ArrowRight size={16} />
            </button>
            <div className="mp-cta-note">Free to register · Choose your programme after</div>
          </div>
        </div>
      </div>

      {/* ── FREE WHATSAPP FLOATING BUTTON ── */}
      <WhatsAppFloatButton />

      <FooterSection />
    </div>
  );
}
