import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';
import { WhatsAppFloatButton } from '@/components/WhatsAppFloatButton';
import {
  ArrowRight, ArrowLeft, ShieldCheck, ChevronDown, CheckCircle2, Users, Award,
  Clock, GraduationCap, LogOut, Target, Repeat, User,
  MinusCircle, FileText, Type, ImageIcon, Shield, Star, TrendingUp,
  BookOpen, Zap, ChevronRight, Mic, Eye, Trophy, Flame, MessageSquare,
  Monitor, MapPin, Phone, Mail, Play, Quote, BarChart2, Layers,
} from 'lucide-react';

export {}; // Make this a module

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}

const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
};

// Scrolling Gallery Component
const galleryImages = [
  { src: '/R1.png', caption: 'Our Pride' },
  { src: '/R2.png', caption: 'Our Pride' },
  { src: '/R113.png', caption: 'Our Pride' },
  { src: '/R3.png', caption: 'Our Pride' },
  { src: '/R4.png', caption: 'Our Pride' },
  { src: '/R115.png', caption: 'Our Pride' },
  { src: '/R5.png', caption: 'Our Pride' },
  { src: '/R116.png', caption: 'Our Pride' },
  { src: '/R6.png', caption: 'Our Pride' },
  { src: '/R111.png', caption: 'Our Pride' },
  { src: '/R112.png', caption: 'Our Pride' },
];

function ScrollingGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="scrolling-gallery">
      <div className="gallery-images">
        {galleryImages.map((img, i) => (
          <div 
            key={i} 
            className={`gallery-slide ${i === currentIndex ? 'active' : ''}`}
            style={{ display: i === currentIndex ? 'block' : 'none' }}
          >
            <img 
              src={img.src} 
              alt={img.caption}
              className="about-img-main"
            />
            <div className="gallery-caption">{img.caption}</div>
          </div>
        ))}
      </div>
      <div className="gallery-dots">
        {galleryImages.map((_, i) => (
          <button 
            key={i} 
            className={`gallery-dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

// Rotating Taglines Component
const rotatingTaglines = [
  "The Uniform Awaits.",
  "Where Leaders Are Forged.",
  "Discipline Defines Destiny.",
  "Excellence Through Preparation.",
  "Serve The Nation With Pride.",
];

function RotatingTaglines() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayText, setDisplayText] = useState(rotatingTaglines[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      // Wait for exit animation to complete
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % rotatingTaglines.length);
        setDisplayText(rotatingTaglines[(currentIndex + 1) % rotatingTaglines.length]);
        setIsAnimating(false);
      }, 800); // Half of the animation duration (0.8s / 2 = 0.4s but we use 0.8 for smooth transition)
    }, 4000); // Change every 4 seconds
    
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="hero-tagline-container">
      <span 
        className={`hero-tagline ${isAnimating ? 'hero-tagline-exit' : 'hero-tagline-enter'}`}
        key={displayText}
      >
        <span className="hero-tagline-text">{displayText}</span>
      </span>
    </div>
  );
}

/* ─────────────────────────────── CSS ─────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --army: #1A2A1B;
    --army-mid: #243325;
    --army-light: #2E4030;
    --gold: #C8A84B;
    --gold-light: #E2C26A;
    --gold-pale: rgba(200,168,75,0.12);
    --cream: #F5F0E8;
    --cream-dark: #EDE7D9;
    --ink: #0D1710;
    --mist: #6B7A6D;
    --white: #FFFFFF;
    --red: #C0392B;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', system-ui, sans-serif; background: var(--cream); color: var(--ink); overflow-x: hidden; }

  /* ── PROGRESS ── */
  .lp-progress { position: fixed; top: 0; left: 0; width: 100%; height: 3px; background: rgba(0,0,0,0.1); z-index: 9999; }
  .lp-bar { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold-light)); transition: width 0.15s; }

  /* ── NAV ── */
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; transition: all 0.3s; background: rgba(13,23,16,0.95); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(200,168,75,0.1); }
  .nav.scrolled { background: rgba(13,23,16,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(200,168,75,0.15); box-shadow: 0 4px 40px rgba(0,0,0,0.3); }
  .nav-inner { max-width: 1400px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 72px; }
  .nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .nav-logo img { height: 38px; width: auto; }
  .nav-logo-wrap { display: flex; flex-direction: column; }
  .nav-logo-name { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; color: var(--white); letter-spacing: 0.08em; line-height: 1; }
  .nav-logo-tag { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); font-weight: 600; }
  .nav-links { display: flex; align-items: center; gap: 2px; }
  .nav-link { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.75); text-decoration: none; padding: 8px 14px; border-radius: 4px; transition: all 0.2s; letter-spacing: 0.02em; }
  .nav-link:hover, .nav-link.active { color: var(--white); background: rgba(255,255,255,0.08); }
  .nav-dropdown-wrap { position: relative; }
  .nav-dropdown-btn { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.75); background: none; border: none; cursor: pointer; padding: 8px 14px; border-radius: 4px; display: flex; align-items: center; gap: 5px; transition: all 0.2s; }
  .nav-dropdown-btn:hover { color: var(--white); background: rgba(255,255,255,0.08); }
  .nav-dropdown { position: absolute; top: calc(100% + 10px); left: 0; background: var(--army-mid); border: 1px solid rgba(200,168,75,0.2); border-radius: 8px; overflow: hidden; min-width: 210px; box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
  .nav-dropdown-item { display: block; padding: 14px 20px; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.15s; }
  .nav-dropdown-item:last-child { border-bottom: none; }
  .nav-dropdown-item:hover { background: rgba(200,168,75,0.1); }
  .nav-dropdown-item-name { font-size: 13px; font-weight: 600; color: var(--white); }
  .nav-dropdown-item-price { font-size: 12px; color: var(--gold); margin-top: 2px; }
  .nav-actions { display: flex; align-items: center; gap: 10px; }
  .nav-btn-ghost { background: none; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); font-size: 13px; font-weight: 500; padding: 8px 18px; border-radius: 4px; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; }
  .nav-btn-ghost:hover { border-color: rgba(255,255,255,0.5); color: var(--white); }
  .nav-btn-primary { background: var(--gold); color: var(--ink); font-size: 13px; font-weight: 700; padding: 9px 20px; border-radius: 4px; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; border: none; letter-spacing: 0.03em; }
  .nav-btn-primary:hover { background: var(--gold-light); }
  .nav-hamburger { display: none; background: none; border: none; color: var(--white); cursor: pointer; }
  .nav-mobile { display: none; background: var(--army); border-top: 1px solid rgba(255,255,255,0.05); }
  .nav-mobile.open { display: block; }
  .nav-mobile-inner { padding: 20px 24px; display: flex; flex-direction: column; gap: 2px; }
  .nav-mobile-link { font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.8); text-decoration: none; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); display: block; }
  .nav-mobile-btns { display: flex; gap: 10px; padding-top: 20px; }

  /* ── HERO ── */
  .hero { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; background: var(--ink); padding-top: 100px; }
  .hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.4; }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(13,23,16,1) 0%, rgba(13,23,16,0.65) 50%, rgba(13,23,16,0.3) 100%); }
  .hero-content { position: relative; z-index: 2; width: 100%; padding: 40px 0; text-align: center; }
  .hero-inner { max-width: 1400px; margin: 0 auto; padding: 0 32px; }
  .hero-tag { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border: 1px solid var(--gold); margin-bottom: 24px; }
  .hero-tag-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); animation: blink 2s infinite; }
  @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.2; } }
  .hero-tag-text { font-size: 11px; font-weight: 700; color: var(--gold); letter-spacing: 0.15em; text-transform: uppercase; }
  .hero-h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 6vw, 5rem); line-height: 1.1; letter-spacing: 0.02em; color: var(--white); margin-bottom: 24px; text-align: center; }
  .hero-h1-line2 { color: var(--gold); display: block; }
  
  /* Rotating Taglines */
  .hero-tagline-container { min-height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 32px; }
  .hero-tagline { position: relative; font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 8vw, 6rem); line-height: 1; letter-spacing: 0.02em; color: var(--gold); }
  .hero-tagline-text { display: inline-block; }
  .hero-tagline-enter { animation: taglineFadeIn 0.8s ease-out forwards; }
  .hero-tagline-exit { animation: taglineFadeOut 0.8s ease-in forwards; }
  @keyframes taglineFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes taglineFadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-20px); }
  }
  
  .hero-sub { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.1rem, 2vw, 1.5rem); color: rgba(255,255,255,0.6); max-width: 700px; line-height: 1.6; margin: 0 auto 40px; font-style: italic; text-align: center; }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; margin-bottom: 60px; }
  .btn-primary { display: inline-flex; align-items: center; gap: 10px; background: var(--gold); color: var(--ink); font-size: 14px; font-weight: 700; padding: 15px 32px; text-decoration: none; transition: all 0.25s; letter-spacing: 0.05em; text-transform: uppercase; border: none; cursor: pointer; }
  .btn-primary:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(200,168,75,0.4); }
  .btn-outline { display: inline-flex; align-items: center; gap: 10px; background: transparent; color: var(--white); font-size: 14px; font-weight: 600; padding: 15px 32px; text-decoration: none; border: 1px solid rgba(255,255,255,0.3); transition: all 0.25s; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer; }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); }
  .hero-pillars { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid rgba(255,255,255,0.08); }
  .hero-pillar { padding: 24px 20px; border-right: 1px solid rgba(255,255,255,0.08); }
  .hero-pillar:last-child { border-right: none; }
  .hero-pillar-val { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; color: var(--gold); line-height: 1; }
  .hero-pillar-label { font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }

  /* ── TICKER ── */
  .ticker { background: var(--gold); padding: 12px 0; overflow: hidden; }
  .ticker-track { display: flex; gap: 0; white-space: nowrap; animation: ticker 30s linear infinite; }
  .ticker-item { display: inline-flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink); padding: 0 40px; }
  .ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--army); opacity: 0.4; }
  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* ── SECTIONS ── */
  .sec { padding: 100px 32px; }
  .sec-inner { max-width: 1400px; margin: 0 auto; }
  .sec-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }
  .sec-h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 4vw, 3.8rem); font-weight: 700; line-height: 1.1; color: var(--ink); margin-bottom: 20px; }
  .sec-h2-white { color: var(--white); }
  .sec-desc { font-size: 1rem; line-height: 1.85; color: var(--mist); max-width: 580px; }
  .rule { width: 60px; height: 2px; background: var(--gold); margin-bottom: 24px; }
  
  /* Navbar spacing - ensure sections don't collide with fixed navbar */
  section { scroll-margin-top: 80px; }

  /* ── WHAT ENLIFT HUB OFFER'S ── */
  .offer { background: var(--army); }
  .offer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; background: rgba(255,255,255,0.04); margin-top: 64px; }
  .offer-card { background: var(--army-mid); padding: 48px 40px; position: relative; overflow: hidden; transition: background 0.3s; }
  .offer-card:hover { background: var(--army-light); }
  .offer-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform 0.4s; }
  .offer-card:hover::before { transform: scaleX(1); }
  .offer-icon { width: 52px; height: 52px; background: var(--gold-pale); border: 1px solid rgba(200,168,75,0.2); display: flex; align-items: center; justify-content: center; color: var(--gold); margin-bottom: 28px; }
  .offer-title { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: var(--white); margin-bottom: 14px; }
  .offer-desc { font-size: 0.9rem; color: rgba(255,255,255,0.5); line-height: 1.8; margin-bottom: 24px; }
  .offer-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); border: 1px solid rgba(200,168,75,0.3); display: inline-block; padding: 4px 12px; }
  /* Carousels - hidden by default */
  .offer-carousel { display: none; }
  .offer-carousel-desktop { display: grid; }
  .video-carousel-mobile { display: none; }
  .video-carousel-desktop { display: block; }

  /* ── ABOUT ── */
  .about { background: var(--white); }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; }
  .about-visual { position: relative; }
  .about-img-main { width: 100%; height: 560px; object-fit: cover; object-position: center top; display: block; }
  .scrolling-gallery { position: relative; width: 100%; height: 560px; overflow: hidden; background: var(--army); }
  .gallery-slide { position: absolute; inset: 0; }
  .gallery-slide img { width: 100%; height: 100%; object-fit: cover; background: transparent; }
  .gallery-caption { position: absolute; bottom: 20px; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: white; padding: 20px; text-align: center; font-size: 1.1rem; font-weight: 600; }
  .gallery-dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 10; }
  .gallery-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.5); border: none; cursor: pointer; transition: all 0.3s; }
  .gallery-dot.active { background: var(--gold); width: 30px; border-radius: 5px; }
  .about-badge { position: absolute; bottom: -24px; right: -24px; background: var(--army); padding: 28px 32px; }
  .about-badge-val { font-family: 'Bebas Neue', sans-serif; font-size: 3.5rem; color: var(--gold); line-height: 1; }
  .about-badge-label { font-size: 11px; color: rgba(255,255,255,0.6); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }
  .about-stripe { position: absolute; top: -12px; left: -12px; width: 80px; height: 80px; border-top: 3px solid var(--gold); border-left: 3px solid var(--gold); }
  .about-p { font-size: 1rem; line-height: 1.9; color: #444; margin-bottom: 20px; }
  .about-points { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 32px; }
  .about-point { display: flex; gap: 12px; align-items: flex-start; }
  .about-point-icon { width: 32px; height: 32px; background: var(--gold-pale); border: 1px solid rgba(200,168,75,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--gold); }
  .about-point-text { font-size: 0.88rem; font-weight: 600; color: var(--army); line-height: 1.4; }
  .about-cmd-strip { margin-top: 40px; padding: 20px 24px; background: var(--cream); border-left: 3px solid var(--gold); }
  .about-cmd-text { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-style: italic; color: var(--army); line-height: 1.6; }
  .about-cmd-attr { font-size: 12px; font-weight: 600; color: var(--mist); margin-top: 8px; letter-spacing: 0.06em; text-transform: uppercase; }

  /* ── 5-DAY SSB JOURNEY ── */
  .journey { background: var(--cream-dark); }
  .journey-timeline { display: grid; grid-template-columns: repeat(5, 1fr); gap: 2px; background: rgba(0,0,0,0.08); margin-top: 64px; }
  .journey-day { background: var(--white); padding: 36px 28px; position: relative; }
  .journey-day.highlight { background: var(--army); }
  .journey-day-num { font-family: 'Bebas Neue', sans-serif; font-size: 1rem; color: var(--gold); letter-spacing: 0.12em; margin-bottom: 8px; }
  .journey-day-title { font-size: 1rem; font-weight: 700; color: var(--ink); margin-bottom: 14px; }
  .journey-day.highlight .journey-day-title { color: var(--white); }
  .journey-day-items { display: flex; flex-direction: column; gap: 8px; }
  .journey-day-item { font-size: 12px; color: var(--mist); display: flex; gap: 8px; line-height: 1.4; }
  .journey-day.highlight .journey-day-item { color: rgba(255,255,255,0.55); }
  .journey-day-item span:first-child { color: var(--gold); font-weight: 700; flex-shrink: 0; }
  .journey-note { margin-top: 40px; background: var(--army); padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
  .journey-note-text { font-size: 1rem; color: rgba(255,255,255,0.7); max-width: 600px; line-height: 1.7; }
  .journey-note-text strong { color: var(--gold); }

  /* ── COURSES ── */
  .courses { background: var(--white); }
  .courses-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; background: rgba(0,0,0,0.06); margin-top: 64px; }
  .course-card { background: var(--cream); padding: 48px 40px; position: relative; }
  .course-card.featured { background: var(--army); }
  .course-card-secondary { background: var(--cream); }
  .course-card-tertiary { background: var(--white); border: 2px solid var(--gold); }
  .course-card-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 5px 12px; display: inline-block; margin-bottom: 24px; }
  .course-card:not(.featured) .course-card-tag { background: var(--gold-pale); color: var(--army); border: 1px solid rgba(200,168,75,0.3); }
  .course-card.featured .course-card-tag { background: var(--gold); color: var(--ink); }
  .course-name { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; }
  .course-card:not(.featured) .course-name { color: var(--ink); }
  .course-card.featured .course-name { color: var(--white); }
  .course-duration { font-size: 13px; color: var(--mist); margin-bottom: 24px; }
  .course-card.featured .course-duration { color: rgba(255,255,255,0.45); }
  .course-features { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
  .course-feature { display: flex; gap: 10px; font-size: 13px; align-items: flex-start; }
  .course-card:not(.featured) .course-feature { color: #444; }
  .course-card.featured .course-feature { color: rgba(255,255,255,0.6); }
  .course-feature-check { color: var(--gold); flex-shrink: 0; margin-top: 1px; }
  .course-price { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; color: var(--gold); margin-bottom: 24px; line-height: 1; }
  .course-price-sub { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--mist); font-weight: 400; margin-bottom: 4px; }
  .course-card.featured .course-price-sub { color: rgba(255,255,255,0.35); }
  .course-card-secondary .course-name { color: var(--ink); }
  .course-card-secondary .course-duration { color: var(--mist); }
  .course-card-secondary .course-feature { color: #444; }
  .course-card-secondary .course-price-sub { color: var(--mist); }
  .course-card-tertiary .course-name { color: var(--army); }
  .course-card-tertiary .course-duration { color: var(--mist); }
  .course-card-tertiary .course-feature { color: #444; }
  .course-card-tertiary .course-price-sub { color: var(--mist); }

  /* ── FACULTY ── */
  .faculty { background: var(--army); }
  .faculty-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; background: rgba(255,255,255,0.05); margin-top: 64px; }
  .faculty-card { background: var(--army-mid); }
  .faculty-img { width: 100%; height: 200px; background: linear-gradient(160deg, var(--army-light) 0%, var(--army) 100%); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
  .faculty-img-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.5) 8px, rgba(255,255,255,0.5) 9px); }
  .faculty-img-rank { position: absolute; top: 14px; left: 14px; font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); background: rgba(0,0,0,0.5); padding: 4px 10px; }
  .faculty-body { padding: 20px; }
  .faculty-name { font-size: 0.95rem; font-weight: 700; color: var(--white); margin-bottom: 4px; }
  .faculty-role { font-size: 12px; color: var(--gold); margin-bottom: 6px; font-weight: 600; }
  .faculty-spec { font-size: 12px; color: rgba(255,255,255,0.4); }

  /* ── TALKS ── */
  .talks { background: var(--cream); }
  .talks-inner { max-width: 1400px; margin: 0 auto; }
  .talks-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 80px; align-items: center; margin-top: 64px; }
  .talks-visual { position: relative; }
  .talks-img { width: 100%; height: 420px; object-fit: cover; display: block; background: var(--army); display: flex; align-items: center; justify-content: center; }
  .talks-play { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .talks-play-btn { width: 80px; height: 80px; background: var(--gold); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; }
  .talks-play-btn:hover { transform: scale(1.1); }
  .talks-cards { display: flex; flex-direction: column; gap: 2px; }
  .talks-card { background: var(--white); padding: 24px 28px; display: flex; gap: 20px; align-items: flex-start; border-left: 3px solid transparent; transition: border-color 0.2s; }
  .talks-card:hover { border-left-color: var(--gold); }
  .talks-card-icon { width: 44px; height: 44px; background: var(--gold-pale); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--gold); }
  .talks-card-title { font-size: 0.95rem; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
  .talks-card-sub { font-size: 12px; color: var(--mist); }

  /* ── PSYCHOLOGY PLATFORM ── */
  .psyplatform { background: var(--ink); padding: 100px 32px; position: relative; overflow: hidden; }
  .psyplatform::before { content: ''; position: absolute; top: -200px; right: -200px; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(200,168,75,0.05) 0%, transparent 70%); }
  .psyplatform-inner { max-width: 1400px; margin: 0 auto; position: relative; z-index: 1; }
  .psyplatform-header { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: end; margin-bottom: 64px; }
  .psyplatform-badge { display: inline-flex; align-items: center; gap: 10px; padding: 8px 20px; background: rgba(200,168,75,0.1); border: 1px solid rgba(200,168,75,0.3); margin-bottom: 20px; }
  .psyplatform-badge-icon { color: var(--gold); }
  .psyplatform-badge-text { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); }
  .psyplatform-tests { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; background: rgba(255,255,255,0.04); }
  .psytest-card { background: rgba(255,255,255,0.03); padding: 32px 28px; border: 1px solid rgba(255,255,255,0.04); transition: all 0.3s; cursor: pointer; position: relative; overflow: hidden; }
  .psytest-card:hover { background: rgba(200,168,75,0.06); border-color: rgba(200,168,75,0.2); }
  .psytest-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform 0.4s; }
  .psytest-card:hover::after { transform: scaleX(1); }
  .psytest-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; border: 1px solid rgba(200,168,75,0.2); padding: 3px 8px; display: inline-block; }
  .psytest-name { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; color: var(--white); margin-bottom: 4px; letter-spacing: 0.05em; }
  .psytest-full { font-size: 11px; color: rgba(255,255,255,0.3); margin-bottom: 18px; }
  .psytest-desc { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.65; margin-bottom: 20px; }
  .psytest-time { font-size: 11px; color: rgba(255,255,255,0.25); border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; }
  .psytest-count { font-size: 12px; color: var(--gold); font-weight: 600; margin-top: 6px; }
  .psyplatform-cta { margin-top: 48px; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
  .psyplatform-note { font-size: 13px; color: rgba(255,255,255,0.3); }

  /* ── DAILY LIFE ── */
  .daily { background: var(--white); }
  .daily-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 80px; align-items: start; margin-top: 64px; }
  .daily-schedule { display: flex; flex-direction: column; gap: 0; }
  .daily-slot { display: flex; gap: 20px; padding: 20px 0; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .daily-slot:last-child { border-bottom: none; }
  .daily-time { font-size: 11px; font-weight: 700; color: var(--gold); letter-spacing: 0.08em; min-width: 80px; padding-top: 2px; }
  .daily-act { font-size: 0.9rem; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
  .daily-why { font-size: 12px; color: var(--mist); line-height: 1.5; }
  .daily-habits { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .habit-card { background: var(--cream); border: 1px solid rgba(0,0,0,0.06); padding: 24px; }
  .habit-card-icon { width: 40px; height: 40px; background: var(--gold-pale); border: 1px solid rgba(200,168,75,0.2); display: flex; align-items: center; justify-content: center; color: var(--gold); margin-bottom: 16px; }
  .habit-card-title { font-size: 0.9rem; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
  .habit-card-desc { font-size: 12px; color: var(--mist); line-height: 1.6; }

  /* ── OLQ ── */
  .olq { background: var(--cream-dark); }
  .olq-intro { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: end; margin-bottom: 64px; }
  .olq-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 2px; background: rgba(0,0,0,0.06); }
  .olq-item { background: var(--white); padding: 28px 24px; }
  .olq-num { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: rgba(200,168,75,0.25); margin-bottom: 8px; }
  .olq-name { font-size: 0.88rem; font-weight: 700; color: var(--army); margin-bottom: 6px; line-height: 1.3; }
  .olq-category { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--mist); }

  /* ── TESTIMONIALS ── */
  .testimonials { background: var(--army); }
  .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; background: rgba(255,255,255,0.05); margin-top: 64px; }
  .testi-card { background: var(--army-mid); padding: 40px 36px; position: relative; }
  .testi-quote { position: absolute; top: 24px; right: 28px; color: rgba(200,168,75,0.12); }
  .testi-text { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-style: italic; color: rgba(255,255,255,0.75); line-height: 1.75; margin-bottom: 28px; }
  .testi-meta { display: flex; gap: 14px; align-items: center; }
  .testi-avatar { width: 44px; height: 44px; background: var(--gold-pale); border: 2px solid rgba(200,168,75,0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--gold); }
  .testi-name { font-size: 14px; font-weight: 700; color: var(--white); }
  .testi-entry { font-size: 12px; color: var(--gold); margin-top: 2px; }
  .testi-stars { display: flex; gap: 2px; color: var(--gold); margin-top: 4px; }

  /* ── INFRA ── */
  .infra { background: var(--white); }
  .infra-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2px; background: rgba(0,0,0,0.06); margin-top: 64px; }
  .infra-item { background: var(--cream); padding: 40px 36px; }
  .infra-icon { width: 56px; height: 56px; background: var(--army); display: flex; align-items: center; justify-content: center; color: var(--gold); margin-bottom: 24px; }
  .infra-title { font-size: 1rem; font-weight: 700; color: var(--army); margin-bottom: 12px; }
  .infra-desc { font-size: 0.9rem; color: var(--mist); line-height: 1.7; }

  /* ── RESULTS ── */
  .results { background: var(--army); }
  .results-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; background: rgba(255,255,255,0.06); margin-bottom: 64px; }
  .result-stat { background: var(--army-mid); padding: 48px 36px; text-align: center; }
  .result-stat-val { font-family: 'Bebas Neue', sans-serif; font-size: 4.5rem; color: var(--gold); line-height: 1; margin-bottom: 8px; }
  .result-stat-label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
  .result-stat-sub { font-size: 12px; color: rgba(255,255,255,0.25); }
  .results-entries { display: grid; grid-template-columns: repeat(6, 1fr); gap: 2px; background: rgba(255,255,255,0.04); }
  .entry-badge { background: rgba(255,255,255,0.03); padding: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.04); }
  .entry-badge-name { font-size: 13px; font-weight: 700; color: var(--white); margin-bottom: 4px; }
  .entry-badge-sub { font-size: 11px; color: rgba(255,255,255,0.3); }

  /* ── FAQ ── */
  .faq { background: var(--cream); }
  .faq-inner { max-width: 840px; margin: 0 auto; }
  .faq-list { margin-top: 56px; }
  .faq-item { border-bottom: 1px solid rgba(0,0,0,0.08); }
  .faq-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 24px 0; background: none; border: none; cursor: pointer; text-align: left; gap: 24px; }
  .faq-q { font-size: 1rem; font-weight: 600; color: var(--army); line-height: 1.4; }
  .faq-chevron { flex-shrink: 0; color: var(--mist); transition: transform 0.25s; }
  .faq-chevron.open { transform: rotate(180deg); color: var(--army); }
  .faq-body { overflow: hidden; max-height: 0; transition: max-height 0.35s ease; }
  .faq-body.open { max-height: 400px; }
  .faq-a { font-size: 0.95rem; line-height: 1.85; color: #555; padding-bottom: 24px; }

  /* ── ENROLL CTA ── */
  .enroll { background: #ffffff; padding: 80px 24px; text-align: center; position: relative; overflow: hidden; border-top: 1px solid rgba(0,0,0,0.08); }
  .enroll-bg { position: absolute; inset: 0; background-image: repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.02) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.02) 60px); }
  .enroll-inner { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }
  .enroll-kicker { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 6vw, 4.5rem); color: #1a1a1a; line-height: 1.1; margin-bottom: 24px; letter-spacing: 0.02em; }
  .enroll-kicker span { color: #C8A84B; display: inline; }
  .enroll-sub { font-size: 1.125rem; color: rgba(0,0,0,0.65); margin-bottom: 40px; line-height: 1.8; max-width: 80%; margin-left: auto; margin-right: auto; }
  .enroll-actions { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-bottom: 32px; }
  .enroll-note { font-size: 13px; color: rgba(0,0,0,0.4); margin-top: 0; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; }

  /* ── FOOTER ── */
  .footer { background: var(--army); border-top: 1px solid rgba(200,168,75,0.1); padding: 72px 32px 40px; }
  .footer-inner { max-width: 1400px; margin: 0 auto; }
  .footer-top { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
  .footer-brand-name { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--white); letter-spacing: 0.08em; margin-bottom: 4px; }
  .footer-brand-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; display: block; }
  .footer-brand-desc { font-size: 13px; color: rgba(255,255,255,0.3); line-height: 1.75; max-width: 260px; }
  .footer-contact { margin-top: 24px; display: flex; flex-direction: column; gap: 10px; }
  .footer-contact-item { display: flex; gap: 10px; align-items: center; font-size: 13px; color: rgba(255,255,255,0.4); }
  .footer-col-title { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 20px; }
  .footer-link { display: block; font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; margin-bottom: 12px; transition: color 0.15s; }
  .footer-link:hover { color: var(--gold); }
  .footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.05); }
  .footer-copy { font-size: 12px; color: rgba(255,255,255,0.2); }
  .footer-disc { font-size: 12px; color: rgba(255,255,255,0.15); }

  /* ── RESPONSIVE ── */
  @media (max-width: 1100px) {
    .about-grid, .daily-grid, .talks-grid { grid-template-columns: 1fr; gap: 48px; }
    .about-visual { order: -1; }
    .faculty-grid { grid-template-columns: repeat(2, 1fr); }
    .footer-top { grid-template-columns: 1fr 1fr; gap: 40px; }
    .psyplatform-header { grid-template-columns: 1fr; gap: 32px; }
    .olq-intro { grid-template-columns: 1fr; gap: 32px; }
    .results-entries { grid-template-columns: repeat(3, 1fr); }
  }

  @media (max-width: 860px) {
    .sec { padding: 80px 24px; }
    section { scroll-margin-top: 70px; }
    .nav-links, .nav-actions { display: none; }
    .nav-hamburger { display: flex; }
    .hero-pillars { grid-template-columns: repeat(2, 1fr); }
    .offer-grid, .courses-grid, .infra-grid, .testi-grid { grid-template-columns: 1fr; }
    .offer-card { padding: 32px 28px; }
    .offer-carousel { display: block !important; }
    .offer-carousel-desktop { display: none !important; }
    /* Video carousel show on mobile */
    .video-carousel-mobile { display: block !important; }
    .video-carousel-desktop { display: none !important; }
    .journey-timeline { grid-template-columns: 1fr 1fr; }
    .olq-grid { grid-template-columns: repeat(3, 1fr); }
    .psyplatform-tests { grid-template-columns: repeat(2, 1fr); }
    .results-stats { grid-template-columns: repeat(2, 1fr); }
    .results-entries { grid-template-columns: repeat(2, 1fr); }
    .about-points { grid-template-columns: 1fr; }
    .daily-habits { grid-template-columns: 1fr; }
    .faculty-grid { grid-template-columns: 1fr 1fr; }
    .footer-top { grid-template-columns: 1fr; gap: 28px; }
    .psyplatform { padding: 80px 24px; }
    .psyplatform-tests .psytest-card { padding: 24px 20px; }
    .psytest-name { font-size: 2rem; }
    .course-card { padding: 32px 24px; }
    /* Better text alignment for mobile */
    .sec-desc, .about-p, .offer-desc, .infra-desc, .testi-text, .daily-why { text-align: left; }
  }

  @media (max-width: 560px) {
    .sec { padding: 72px 16px; }
    section { scroll-margin-top: 65px; }
    .hero-h1 { font-size: 1.8rem; }
    .hero-tagline { font-size: 2.5rem; }
    .hero-tagline-container { min-height: 70px; }
    .hero-pillars { grid-template-columns: 1fr 1fr; }
    .hero-actions { flex-direction: column; align-items: center; }
    .hero-actions .btn-primary, .hero-actions .btn-outline { width: 100%; max-width: 280px; justify-content: center; }
    .journey-timeline { grid-template-columns: 1fr; }
    .olq-grid { grid-template-columns: 1fr 1fr; }
    .psyplatform-tests { grid-template-columns: 1fr; }
    .results-stats { grid-template-columns: 1fr 1fr; }
    .results-entries { grid-template-columns: 1fr; }
    .faculty-grid { grid-template-columns: 1fr; }
    .enroll-actions { flex-direction: column; align-items: center; }
    .nav-inner { padding: 0 20px; }
    .about-badge { right: 0; bottom: -20px; }
    /* Offer cards mobile */
    .offer-card { padding: 24px 20px; }
    .offer-title { font-size: 1.3rem; }
    .offer-desc { font-size: 0.85rem; line-height: 1.6; }
    .offer-icon { width: 44px; height: 44px; margin-bottom: 20px; }
    .offer-tag { font-size: 9px; padding: 3px 10px; }
    /* Course cards mobile */
    .course-card { padding: 24px 20px; }
    .course-name { font-size: 1.4rem; }
    .course-price { font-size: 2rem; }
    /* Psychology platform mobile */
    .psyplatform-tests { gap: 12px; }
    .psytest-card { padding: 20px 16px; }
    .psytest-name { font-size: 1.8rem; }
    .psytest-desc { font-size: 12px; }
    .psytest-time { font-size: 10px; }
    /* Faculty mobile */
    .faculty-card { padding-bottom: 16px; }
    .faculty-body { padding: 16px; }
    .faculty-name { font-size: 0.9rem; }
    /* Testimonial mobile */
    .testi-card { padding: 28px 20px; }
    .testi-text { font-size: 0.95rem; }
    /* Infra mobile */
    .infra-item { padding: 28px 20px; }
    .infra-title { font-size: 0.95rem; }
    .infra-desc { font-size: 0.85rem; }
    /* Daily schedule mobile */
    .daily-slot { gap: 12px; padding: 16px 0; }
    .daily-time { font-size: 10px; min-width: 60px; }
    .daily-act { font-size: 0.85rem; }
    .daily-why { font-size: 11px; }
    /* Habit cards mobile */
    .habit-card { padding: 20px 16px; }
    .habit-card-title { font-size: 0.85rem; }
    .habit-card-desc { font-size: 11px; }
    /* OLQ mobile */
    .olq-item { padding: 20px 16px; }
    .olq-name { font-size: 0.8rem; }
    .olq-num { font-size: 1.5rem; }
    .olq-category { font-size: 9px; }
  }
  
  @media (max-width: 480px) {
    .hero { padding: 90px 16px 60px; }
    .hero-h1 { font-size: 1.6rem; }
    .hero-p { font-size: 0.95rem; }
    .hero-btn { padding: 12px 20px; font-size: 0.9rem; }
    .hero-btns { flex-direction: column; gap: 10px; }
    .sec { padding: 56px 16px; }
    section { scroll-margin-top: 60px; }
    .sec-h2 { font-size: 1.4rem; }
    .sec-desc { font-size: 0.9rem; }
    .exam-grid { grid-template-columns: 1fr; }
    .exam-card { padding: 16px; }
    .testi-grid { grid-template-columns: 1fr; }
    .results-stats { grid-template-columns: 1fr; }
    .results-entries { grid-template-columns: 1fr; }
    .daily-grid { grid-template-columns: 1fr; }
    .cta-box { padding: 32px 16px; }
    .cta-h2 { font-size: 1.3rem; }
    .navbar { padding: 12px 16px; }
    .nav-logo { font-size: 1.1rem; }
    .nav-links { display: none; }
    /* Additional offer card fixes */
    .offer-card { padding: 20px 16px; }
    .offer-title { font-size: 1.2rem; margin-bottom: 10px; }
    .offer-desc { font-size: 0.8rem; margin-bottom: 16px; }
    .offer-icon { width: 40px; height: 40px; margin-bottom: 16px; }
    .offer-icon svg { width: 20px; height: 20px; }
    /* Course card fixes */
    .course-card { padding: 20px 16px; }
    .course-name { font-size: 1.2rem; }
    .course-features { gap: 8px; }
    .course-feature { font-size: 12px; }
    .course-price { font-size: 1.8rem; }
    /* Psychology test fixes */
    .psytest-card { padding: 16px 14px; }
    .psytest-name { font-size: 1.5rem; }
    .psytest-full { font-size: 10px; }
    .psytest-desc { font-size: 11px; margin-bottom: 12px; }
    .psytest-tag { font-size: 8px; padding: 2px 6px; margin-bottom: 12px; }
    /* Faculty fixes */
    .faculty-img { height: 160px; }
    .faculty-name { font-size: 0.85rem; }
    .faculty-role { font-size: 11px; }
    .faculty-spec { font-size: 11px; }
    /* Testimonial fixes */
    .testi-card { padding: 24px 16px; }
    .testi-text { font-size: 0.9rem; line-height: 1.6; }
    .testi-name { font-size: 13px; }
    /* Results stats */
    .result-stat { padding: 32px 20px; }
    .result-stat-val { font-size: 3rem; }
    .result-stat-label { font-size: 10px; }
    /* Footer fixes */
    .footer { padding: 48px 16px 32px; }
    .footer-top { gap: 24px; }
    /* Journey timeline */
    .journey-day { padding: 24px 16px; }
    .journey-day-title { font-size: 0.9rem; }
    .journey-day-item { font-size: 11px; }
    /* Offer carousel mobile */
    .offer-carousel { position: relative; margin-top: 32px; }
    .offer-carousel-track { display: flex; transition: transform 0.4s ease; }
    .offer-carousel-card { min-width: 100%; padding: 0 16px; }
    .offer-carousel-card .offer-card { padding: 24px 20px; }
    .offer-carousel-dots { display: flex; justify-content: center; gap: 8px; margin-top: 20px; }
    .offer-carousel-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.3); border: none; cursor: pointer; transition: all 0.3s; }
    .offer-carousel-dot.active { background: var(--gold); width: 30px; border-radius: 5px; }
    .offer-carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(200,168,75,0.9); color: #0D1710; border: none; width: 36; height: 36; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .offer-carousel-btn.prev { left: -5px; }
    .offer-carousel-btn.next { right: -5px; }
    /* Video carousel mobile */
    .video-carousel { position: relative; }
    .video-carousel-track { display: flex; transition: transform 0.4s ease; }
    .video-carousel-slide { min-width: 100%; padding: 0 40px; }
    .video-carousel-dots { display: flex; justify-content: center; gap: 8px; margin-top: 16px; }
    .video-carousel-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.3); border: none; cursor: pointer; transition: all 0.3s; }
    .video-carousel-dot.active { background: var(--gold); }
    .video-carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(200,168,75,0.9); color: #0D1710; border: none; width: 32; height: 32; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .video-carousel-btn.prev { left: 0; }
    .video-carousel-btn.next { right: 0; }
  }
`;

/* ────────── DATA ────────── */
const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About SSB', path: '/ssb-about' },
  { label: 'SSB Process', path: '/ssb-process' },
  { label: 'Preparation Guide', path: '/ssb-preparation' },
  { label: 'Officer Qualities', path: '/ssb-qualities' },
  { label: 'Experiences', path: '/ssb-info#experiences' },
];

const offerCards = [
  {
    icon: GraduationCap,
    title: 'Elite Classroom Program',
    tag: 'Offline · Selective Batch of 10 · Entrance Required',
    desc: 'Our classroom program is designed for a highly selective batch of only 10 candidates. Admission is granted only after clearing the Enlift Hub Entrance Assessment, ensuring that every participant in the batch is serious, capable, and committed to cracking the SSB. Selected candidates undergo intensive on-ground preparation, including full SSB simulations, GTO ground training, psychology test labs, and structured mock interview panels. The entire training is conducted under the mentorship of experienced ex-defence officers, providing candidates with realistic exposure to the SSB environment and personalized feedback to improve their performance.',
  },
  {
    icon: Monitor,
    title: 'Online SSB Mentorship',
    tag: 'Live · Batch of 20 · 4 Hours Daily Mentorship',
    desc: 'For candidates who cannot relocate, Enlift Hub offers a structured online mentorship program designed to deliver focused SSB preparation from anywhere. Admission requires clearing the Enlift Hub Pre-Assessment, after which selected candidates join a disciplined batch of 20 aspirants. The program includes daily 4-hour live sessions, psychology test walkthroughs, structured preparation modules, and guided practice. Candidates also receive personalized feedback, doubt-clearing support, and mock interview preparation, helping them build confidence and clarity. The program ensures consistent preparation and accountability similar to a physical training environment.',
  },
  {
    icon: Layers,
    title: 'Digital Psych Practice Platform',
    tag: 'Digital · Free Access · Unlimited Practice',
    desc: 'For aspirants who wish to practice SSB psychological tests independently, Enlift Hub provides a dedicated digital psychology practice platform. Candidates can practice PPDT, TAT, WAT, and SRT under real SSB timing conditions, helping them develop clarity of thought and faster response ability. The platform includes multiple question sets and unlimited attempts, allowing candidates to practice as often as they want and track their improvement. It is designed to simulate the real test environment and help candidates become comfortable with the psychology stage before appearing for the SSB.'
  },
];

const journey = [
  {
    day: 'Day 1', title: 'Screening',
    items: ['OIR Test (Verbal & Non-Verbal)', 'PPDT — Picture Perception', 'Group Discussion', '~60% eliminated here'],
  },
  {
    day: 'Day 2', title: 'Psychology Tests',
    items: ['TAT — 12 images, 4 min each', 'WAT — 60 words, 15 sec each', 'SRT — 60 situations, 30 min', 'Self Description Test'],
  },
  {
    day: 'Day 3', title: 'GTO — Part 1',
    items: ['Group Discussion', 'Group Planning Exercise', 'Progressive Group Task', 'Half Group Task'],
    highlight: true,
  },
  {
    day: 'Day 4', title: 'GTO — Part 2 + PI',
    items: ['Individual Obstacles', 'Command Task', 'Final Group Task', 'Personal Interview begins'],
    highlight: true,
  },
  {
    day: 'Day 5', title: 'Conference & Result',
    items: ['Personal Interview concludes', 'Board Conference', 'Chest Number Announcement', 'Medical begins for recommended'],
  },
];

const courses = [
  {
    tag: '15 Days · Offline',
    name: 'Elite Residential Program',
    duration: 'Selective Batch of 10 candidates. Admission through Enlift Hub Entry Assessment.',
    price: '₹9,999',
    priceLabel: 'Starting from',
    features: [
      'Complete end-to-end SSB preparation',
      'Full Psychology training (TAT, WAT, SRT, PPDT)',
      'GTO ground tasks with ex-GTO officers',
      'Mock personal interviews & PIQ analysis',
      'OLQ-focused personality development',
    ],
    featured: true,
  },
  {
    tag: '15 Days · Live Online',
    name: 'Online SSB Preparation',
    duration: 'Admission through Enlift Hub Entry Assessment.',
    price: '₹4,999',
    priceLabel: 'Starting from',
    features: [
      'Complete end-to-end SSB preparation',
      'Psychology tests preparation & practice',
      'GTO strategy & planning tasks',
      'Interview preparation & PIQ guidance',
      'Daily structured live mentorship',
    ],
    featured: false,
    variant: 'secondary',
  },
  {
    tag: 'Self-Practice Platform',
    name: 'Digital Psychology Practice',
    duration: 'Practice TAT, WAT, SRT & PPDT under real timing.',
    price: '₹1,999',
    priceLabel: 'Starting from',
    features: [
      'Unlimited psychology test attempts',
      'Real SSB timing simulation',
      'AI-assisted feedback & improvement tips',
      'Structured response guidance',
      'Track your psychology performance',
    ],
    featured: false,
    variant: 'tertiary',
  },
];

const facultyData = [
  { name: 'Brig. Sanjay Ghosh (Retd.)', rank: 'Ex-Army', role: 'Commandant & Leadership Expert', spec: 'Former Commandant · 25 yrs', image: '/sanjoyghosh.jpeg' },
  { name: 'Col. Aditya Budhiraja (Retd.)', rank: 'Ex-Army', role: 'Psychologist & Psychology Expert', spec: 'TAT · WAT · SRT · SDT · 18 yrs', image: '/Col.AB.png' },
  { name: 'Cdr. ABC (Retd.)', rank: 'Ex-Navy', role: 'GTO & Interviewing Officer', spec: 'GTO Ground Training · PI Expert', image: '/sanjoyghosh1.jpeg' },
  { name: 'Harsh Joshi', rank: 'Admin', role: 'Operations & Administration', spec: 'Enlift hub Founder', image: '/Harshjoshi.png' },
];
 
const talksCards = [
  { icon: Mic, title: 'Commander Speaks Series', sub: 'Monthly talks with current serving officers — Colonels, Commandants, and Wing Commanders sharing ground truth.' },
  { icon: Trophy, title: 'Recommended Candidates', sub: 'Our recommended students return to share their board experience, answer questions, and inspire the next batch.' },
  { icon: Eye, title: 'Behind-the-Board Insights', sub: 'Ex-SSB assessors reveal how the board actually thinks — what they observe, what they discard, what makes a candidate stand out.' },
  { icon: Flame, title: 'Bonfire Nights', sub: 'Open circles where aspirants, mentors and veterans discuss leadership, life in uniform, and what it truly means to be an officer.' },
];

const daily = [
  { time: '5:30 AM', act: 'Physical Training', why: 'GTO tasks demand physical readiness. Build stamina for Individual Obstacles, Group Tasks, and Snake Race.' },
  { time: '7:30 AM', act: 'Newspaper & Current Affairs', why: 'Lecturettes and Personal Interview draw heavily from defence news, international relations, and national issues.' },
  { time: '9:00 AM', act: 'Psychology Practice', why: 'TAT, WAT, SRT — your mind\'s freshest hour is the best time to train instinctive responses under time pressure.' },
  { time: '11:00 AM', act: 'OLQ Reflection & Self-Assessment', why: 'Rate yourself on each of the 15 OLQs. Identify gaps. Write a daily entry noting moments where OLQs showed up.' },
  { time: '2:00 PM', act: 'Group Discussion / Lecturette Drill', why: 'Speak for 3 minutes on any topic. Record it. Playback and observe body language, clarity, and confidence.' },
  { time: '4:30 PM', act: 'Hobby / Creative Pursuit', why: 'Hobbies reveal personality during PIQ and interview. Depth in any hobby is valued over breadth.' },
  { time: '7:00 PM', act: 'Mock Interview Practice', why: 'Practice answering PIQ-based questions aloud. Consistency in your narrative is what assessors look for.' },
];

const habits = [
  { icon: BookOpen, title: 'Read Military Biographies', desc: 'Sam Manekshaw, Field Marshal Cariappa, Param Vir Chakra recipients — their stories build the officer mindset.' },
  { icon: MessageSquare, title: 'Volunteer & Lead', desc: 'Organise events. Take initiative in group settings. Initiative is the first OLQ — practice it in daily life.' },
  { icon: Target, title: 'Journal Your Decisions', desc: 'Write down 3 decisions you made today and why. SSB looks for speed and quality of decision-making.' },
  { icon: BarChart2, title: 'Track Your Growth', desc: 'Rate yourself weekly on each OLQ. Growth in self-awareness is itself an OLQ — Effective Intelligence.' },
];

const olqs = [
  { num: '01', name: 'Effective Intelligence', cat: 'Planning & Organising' },
  { num: '02', name: 'Reasoning Ability', cat: 'Planning & Organising' },
  { num: '03', name: 'Organising Ability', cat: 'Planning & Organising' },
  { num: '04', name: 'Power of Expression', cat: 'Planning & Organising' },
  { num: '05', name: 'Social Adaptability', cat: 'Social Adjustment' },
  { num: '06', name: 'Cooperation', cat: 'Social Adjustment' },
  { num: '07', name: 'Sense of Responsibility', cat: 'Social Adjustment' },
  { num: '08', name: 'Initiative', cat: 'Social Effectiveness' },
  { num: '09', name: 'Self-Confidence', cat: 'Social Effectiveness' },
  { num: '10', name: 'Speed of Decision', cat: 'Social Effectiveness' },
  { num: '11', name: 'Influencing the Group', cat: 'Social Effectiveness' },
  { num: '12', name: 'Liveliness', cat: 'Social Effectiveness' },
  { num: '13', name: 'Determination', cat: 'Dynamic Factor' },
  { num: '14', name: 'Courage', cat: 'Dynamic Factor' },
  { num: '15', name: 'Stamina', cat: 'Dynamic Factor' },
];

const testimonials = [
  { text: 'Enlift hub changed the way I thought about SSB. The faculty did not give me answers — they helped me find my own voice. I was recommended on my second attempt from 11 SSB Allahabad.', name: 'Lt. Prashant Rawat', entry: 'CDS II 2024 · Indian Army' },
  { text: 'The psychology platform let me practice 40+ TAT stories before I walked into the board. When the images came, my mind was already trained. Recommended in my first attempt — NDA Entry.', name: 'Officer Cadet Aryan Mehta', entry: 'NDA 153 · IMA Dehradun' },
  { text: 'After two consecutive conferences, I had almost lost hope. The 15-day residential course at Enlift rebuilt not just my preparation but my belief. Third attempt — recommended from 33 SSB Bhopal.', name: 'Cadet Riya Sharma', entry: 'TES Entry · NDA' },
];

const psyTests = [
  { tag: 'Stage I', name: 'PPDT', full: 'Picture Perception & Discussion Test', desc: 'A hazy image. 30 seconds to observe. 4 minutes to write a story. Then narrate and discuss with strangers under assessor observation.', time: '30 sec view · 4 min story · Group discussion' },
  { tag: 'Stage II', name: 'TAT', full: 'Thematic Apperception Test', desc: '12 images in 48 minutes. Your stories reveal themes of initiative, responsibility, and how you think when time runs out mid-sentence.', time: '12 images · 4 min each' },
  { tag: 'Stage II', name: 'WAT', full: 'Word Association Test', desc: '60 words. 15 seconds per word. The first sentence that comes to your mind. There are no right answers — only natural ones.', time: '60 words · 15 sec each' },
  { tag: 'Stage II', name: 'SRT', full: 'Situation Reaction Test', desc: '60 everyday situations. 30 minutes total. How you instinctively react reveals your practical judgment and sense of responsibility.', time: '60 situations · 30 min' },
];

const videoIds = [
  'MIYw2fBlNRs',
  'iZ4wBvtIkew',
  'gyzwMj60sec',
  '-QxCy290iiM',
  'VTO_348SPyQ',
  'yjW8USIBIac',
  'vHikNjf1KjI',
  '3XmjBQClIww',
];

const infraItems = [
  { icon: Target, title: 'GTO Ground', desc: 'Full-scale Group Testing Officer ground with 50+ obstacles — Snake Race platforms, Half Group Task structures, Progressive obstacles, and Command Task equipment.' },
  { icon: Eye, title: 'Psychology Lab', desc: 'Dedicated psychology practice rooms simulating actual SSB conditions — from projected images for TAT to timed WAT and SRT sessions.' },
  { icon: Mic, title: 'Interview Chambers', desc: 'Mock interview rooms with recording capability. Review your posture, expression and responses. Practice under conditions that mirror the actual IO room.' },
  { icon: BookOpen, title: 'Library & Study Rooms', desc: 'Curated defence library — military biographies, SSB guides, current affairs archives, and recommended reading for the Personal Interview.' },
  { icon: Users, title: 'Group Discussion Arenas', desc: 'Circular discussion rooms designed for Lecturette practice, PPDT group narratives, and Group Planning Exercises with peer observation.' },
  { icon: Shield, title: 'Residential Facility', desc: 'On-campus accommodation for residential batches. Early morning PT, bonfire nights, mess facility — the full immersive preparation environment.' },
];

const entries = [
  { name: 'NDA & NA', sub: 'Army · Navy · Air Force' },
  { name: 'CDS', sub: 'IMA · INA · AFA · OTA' },
  { name: 'AFCAT', sub: 'Flying · GT · NT Branch' },
  { name: 'TES', sub: '10+2 Technical Entry' },
  { name: 'TGC / SSC Tech', sub: 'Graduate Entry' },
  { name: 'NCC Special', sub: 'Direct Entry' },
];

const faqs = [
  { q: 'What entries does Enlift hub prepare candidates for?', a: 'We prepare candidates for all defence entries — NDA & NA, CDS (IMA, INA, AFA, OTA), AFCAT, TES, TGC, SSC Tech (Men & Women), NCC Special Entry, and all direct university entries. Our faculty has experience across Army, Navy, and Air Force boards.' },
  { q: 'When do new batches start?', a: 'Residential offline batches start every Monday. Online mentorship batches start on the 1st and 15th of each month. We recommend registering at least 2 weeks in advance to secure a seat, as batch sizes are capped at 12 candidates.' },
  { q: 'How is your approach different from template-based coaching?', a: 'We do not provide model stories, fixed TAT structures, or memorised WAT responses. SSB psychologists are trained to identify coached responses — they become a disqualifying factor. We develop your natural thinking ability under pressure, which is what the board actually looks for.' },
  { q: 'Can repeaters (conference candidates) join the residential course?', a: 'Yes, and we encourage it. Repeaters form a significant part of our batch. We assign one-on-one mentor sessions specifically to identify what went wrong in previous boards and design personalised improvement plans before the coaching begins.' },
  { q: 'What is the Psychology Practice Platform and is it free?', a: 'Our psychology practice platform allows candidates to practice PPDT, TAT, WAT, and SRT under exact SSB timing — unlimited, from anywhere. It is free for all registered candidates. Access it from your dashboard under "Start Preparation."' },
  { q: 'Do you conduct mock SSB boards?', a: 'Yes. Every residential batch ends with a full Mock SSB — a complete 2-day simulation including screening tests, psychology, GTO tasks, and mock personal interview, observed and evaluated by ex-board officers. Feedback is given individually in a closing conference.' },
  { q: 'How do the talks with serving officers work?', a: 'We conduct monthly "Commander Speaks" sessions where serving and recently retired officers — Colonels, Commandants, Wing Commanders — interact directly with our aspirants. These are unscripted Q&A sessions focused on life in service, leadership, and what officers genuinely look for in candidates.' },
];

/* ────────── COMPONENTS ────────── */

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="faq sec">
      <div className="faq-inner">
        <div style={{ textAlign: 'center' }}>
          <p className="sec-eyebrow">Common Questions</p>
          <div className="rule" style={{ margin: '12px auto 20px' }} />
          <h2 className="sec-h2">Everything you need to know.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div className="faq-item" key={i}>
              <button className="faq-btn" onClick={() => setOpen(open === i ? null : i)}>
                <span className="faq-q">{f.q}</span>
                <ChevronDown className={`faq-chevron${open === i ? ' open' : ''}`} size={20} />
              </button>
              <div className={`faq-body${open === i ? ' open' : ''}`}>
                <p className="faq-a">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── MAIN PAGE ────────── */
export default function LandingPage() {
  const [progress, setProgress] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [currentMobileVideoIndex, setCurrentMobileVideoIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      setProgress(Math.min((window.scrollY / (doc.scrollHeight - window.innerHeight)) * 100, 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { trackEvent('landing_page_view'); }, []);

  const tickerItems = ['500+ Recommended Officers', 'Ex-Defence Officer Faculty', 'NDA · CDS · AFCAT · TES', 'GTO Ground Training', 'Psychology Lab', 'Mock SSB Board', 'Commander Talks', 'Real SSB Conditions'];

  return (
    <>
      <title>Enlift hub — The guide to defence | Offline · Online · Practice Platform</title>
      <meta name="description" content="Enlift hub offers comprehensive defence preparation guidance, practice tests and mentorship by ex-defence officers. 500+ candidates recommended across Army, Navy and Air Force." />
      <style>{css}</style>

      <div className="lp-progress"><div className="lp-bar" style={{ width: `${progress}%` }} /></div>

      <NavbarSection />

      {/* ── HERO ── */}
      <section className="hero">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="public/ssb-hero.mp4" type="video/mp4" />
        </video>
        
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-inner">
            {/* Main Headline - Golden Box */}
            <div className="hero-tag">
              <span className="hero-tag-dot" />
              <span className="hero-tag-text">India's Premier SSB Coaching Institute</span>
            </div>
            
            {/* Rotating Taglines */}
            <RotatingTaglines />
            
            {/* Subheading - Centered */}
            <p className="hero-sub">
              Where officers are made — not by accident, but by preparation, discipline, and the right mentorship.
            </p>
            
            {/* 3 CTA Buttons - Centered */}
            <div className="hero-actions">
              <Link to="/register" className="btn-primary" onClick={() => trackEvent('cta_hero_primary')}>
                Enroll in Batch <ArrowRight size={16} />
              </Link>
              <Link to="/ssb-about" className="btn-outline">
                About Us <ChevronRight size={16} />
              </Link>
              <Link to="/dashboard" className="btn-outline">
                Practice Psyc <Target size={16} />
              </Link>
            </div>
            
            <div className="hero-pillars">
              {[
                { val: '500+', label: 'Officers Recommended' },
                { val: '85%', label: 'Success Rate' },
                { val: '12+', label: 'Years Experience' },
                { val: '10+', label: 'Expert Mentors' },
              ].map(s => (
                <div className="hero-pillar" key={s.val}>
                  <div className="hero-pillar-val">{s.val}</div>
                  <div className="hero-pillar-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span className="ticker-item" key={i}>
              {item}
              <span className="ticker-dot" />
            </span>
          ))}
        </div>
      </div>

{/* ── ABOUT ENLIFT HUB ── */}
      <section className="about sec">
        <div className="sec-inner">

          {/* Heading - Full width, centered */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <p
              className="sec-eyebrow"
              style={{
                fontSize: '32px',
                letterSpacing: '0.15em',
                fontWeight: 800,
                color: '#B8860B',
                marginBottom: 8,
              }}
            >
              WHAT IS ENLIFT HUB?
            </p>
            <div className="rule" style={{ margin: '6px auto 0' }} /><br></br>
<p style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.1em' }}>
          
            </p>
          </div>

          {/* Two column grid for content */}
          <div className="about-grid" style={{ alignItems: 'start' }}> {/* FIX 2: no dead space above photo */}

            <div className="about-visual">

              {/* FIX 3: Tagline above photo — fills the empty space */}
              <div style={{ marginBottom: 25, paddingLeft: 1 }}>
                <p style={{
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#b8962e',
                  fontWeight: 700,
                  marginBottom: 6,
                  margin: '0 0 6px 0',
                }}>
                </p>
                <h3 style={{
                  fontSize: 'clamp(10px, 2vw, 24px)',
                  fontWeight: 800,
                  color: '#111',
                  lineHeight: 1.25,
                  margin: 0,
                }}>
                     PATH TO WALK TO SUCCESS
                </h3>
              </div>

              <div className="about-stripe" />
              <ScrollingGallery />
              <div className="about-badge">
                <div className="about-badge-val">our pride</div>
                <div className="about-badge-label"> </div>
              </div>
            </div>

            <div>
              <h2 className="sec-h2">We have walked the path you are about to walk.</h2>

              {/* FIX 4: justified text */}
              <p className="about-p" style={{ textAlign: 'justify' }}>Enlift hub was founded by ex-defence officers who have cleared SSB, served the nation, and have sat across the table as assessors. We built this institute because we understood exactly what genuine preparation looks like — and what it does not.</p>
              <p className="about-p" style={{ textAlign: 'justify' }}>Most coaching institutes focus on tips, templates, and model answers. SSB is specifically designed to detect exactly that. Our approach is different — we develop the candidate's actual personality, thinking ability, and situational awareness through honest, rigorous practice.</p>
              <p className="about-p" style={{ textAlign: 'justify' }}>From our GTO ground to our psychology lab, from our mock interview chambers to our monthly talks with serving commanders — everything here exists to give aspirants one thing: the edge of genuine readiness.</p>

              <div className="about-points">
                {[
                  { icon: Shield, text: 'Led by Ex-SSB Officers & Assessors' },
                  { icon: Users, text: 'Batch size capped at 12 candidates' },
                  { icon: Award, text: 'Full SSB infrastructure on-site' },
                  { icon: Mic, text: 'Monthly talks with serving officers' },
                  { icon: Target, text: 'Genuine OLQ development — no templates' },
                  { icon: Monitor, text: 'Digital psychology platform included' },
                ].map(p => (
                  <div className="about-point" key={p.text}>
                    <div className="about-point-icon"><p.icon size={16} /></div>
                    <div className="about-point-text">{p.text}</div>
                  </div>
                ))}
              </div>

              <div className="about-cmd-strip">
                <div className="about-cmd-text">"The SSB doesn't select the most intelligent candidate. It selects the most genuine one — the one who has actually lived the qualities we are looking for."</div>
                <div className="about-cmd-attr">— Brig Sanjoy Ghosh (Retd.), Founder</div>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* ── WHAT WE OFFER (Three paths to board) ── */}
      <section className="offer sec">
        <div className="sec-inner">
          {/* Heading - Full width, centered */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1
              className="sec-eyebrow"
              style={{
                fontSize: '32px',
                letterSpacing: '0.15em',
                fontWeight: 800,
                color: '#C8A84B',
                marginBottom: 8,
              }}
            >
              WHAT ENLIFT HUB OFFER'S?
            </h1>
            <div className="rule" style={{ margin: '0 auto' }} />
          </div>
          {/* Subheading - centered */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h3 className="sec-h2 sec-h2-white" style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Three paths to the board.</h3>
            <p className="sec-desc" style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '800px', margin: '16px auto 0', textAlign: 'center', lineHeight: 1.8 }}>Whether you prefer elite classroom immersion, structured online mentorship, or independent psychology practice, Enlift Hub provides a preparation pathway designed for every serious SSB aspirant.</p>
          </div>
          {/* Three cards in a single row - Desktop */}
          <div className="offer-carousel" style={{ display: 'none' }}>
            <div className="offer-carousel-track" style={{ transform: `translateX(-${currentOfferIndex * 100}%)` }}>
              {offerCards.map((c, idx) => (
                <div className="offer-carousel-card" key={idx}>
                  <div className="offer-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="offer-icon"><c.icon size={22} /></div>
                    <div className="offer-title">{c.title}</div>
                    <div className="offer-desc" style={{ textAlign: 'justify', flex: 1 }}>{c.desc}</div>
                    <span className="offer-tag">{c.tag}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="offer-carousel-btn prev" onClick={() => setCurrentOfferIndex((currentOfferIndex - 1 + offerCards.length) % offerCards.length)}><ArrowLeft size={18} /></button>
            <button className="offer-carousel-btn next" onClick={() => setCurrentOfferIndex((currentOfferIndex + 1) % offerCards.length)}><ArrowRight size={18} /></button>
            <div className="offer-carousel-dots">
              {offerCards.map((_, idx) => (
                <button key={idx} className={`offer-carousel-dot ${idx === currentOfferIndex ? 'active' : ''}`} onClick={() => setCurrentOfferIndex(idx)} />
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'stretch' }} className="offer-carousel-desktop">
            {offerCards.map(c => (
              <div className="offer-card" key={c.title} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="offer-icon"><c.icon size={22} /></div>
                <div className="offer-title">{c.title}</div>
                <div className="offer-desc" style={{ textAlign: 'justify', flex: 1 }}>{c.desc}</div>
                <span className="offer-tag">{c.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIGITAL PRACTICE PLATFORM (Left SSB) ── */}
      <section className="psyplatform" style={{ background: '#0D1710' }}>
        <div className="psyplatform-inner">
          {/* Heading - Full width, centered */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1
              className="sec-eyebrow"
              style={{
                fontSize: '32px',
                letterSpacing: '0.15em',
                fontWeight: 800,
                color: '#C8A84B',
                marginBottom: 8,
              }}
            >
              WHAT IS OUR DIGITAL PLATFORM?
            </h1>
            <div className="rule" style={{ margin: '0 auto' }} />
          </div>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div>
              <h3 className="sec-h2 sec-h2-white" style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Your psychology tests. Practiced before you walk in.</h3>
            </div>
            <p className="sec-desc" style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '800px', margin: '0 auto', textAlign: 'center', lineHeight: 1.8 }}>Practice TAT, WAT, SRT and PPDT under real SSB timing — unlimited attempts, any time, from anywhere. Access it from your dashboard the moment you register.</p>
          </div>
          {/* Platform Features - Full Width */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: 32, marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C8A84B', marginBottom: 24, textAlign: 'center' }}>Platform Features</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px 32px' }}>
              {[
                'Real SSB timing enforced (no pause, no edit)',
                '150+ unique psychology question sets',
                'Unlimited practice attempts — no caps',
                'All 4 psychology tests in one place',
                'Practice from any device, any time',
                'Free for all registered candidates',
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <span style={{ color: '#C8A84B', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="psyplatform-tests">
            {psyTests.map(t => (
              <Link to="/register" className="psytest-card" key={t.name} style={{ textDecoration: 'none' }}>
                <div className="psytest-tag">{t.tag}</div>
                <div className="psytest-name">{t.name}</div>
                <div className="psytest-full">{t.full}</div>
                <div className="psytest-desc">{t.desc}</div>
                <div className="psytest-time">{t.time}</div>
              </Link>
            ))}
          </div>
          <div className="psyplatform-cta" style={{ justifyContent: 'center' }}>
            <Link to="/register" className="btn-primary" onClick={() => trackEvent('cta_platform')}>
              Access the Platform — Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FACULTY ── */}
      <section style={{ background: '#FFFFFF', padding: '100px 32px' }}>
        <div className="sec-inner">
          {/* Heading - Full width, centered */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1
              className="sec-eyebrow"
              style={{
                fontSize: '32px',
                letterSpacing: '0.15em',
                fontWeight: 800,
                color: '#C8A84B',
                marginBottom: 8,
              }}
            >
              WHO TEACHES YOU?
            </h1>
            <div className="rule" style={{ margin: '0 auto' }} />
          </div>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div>
              <h3 className="sec-h2" style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', letterSpacing: '0.02em', textTransform: 'uppercase', color: '#0D1710', marginBottom: 16 }}>Officers who assessed - now they mentor.</h3>
            </div>
            <p className="sec-desc" style={{ color: '#444', maxWidth: '800px', margin: '0 auto', textAlign: 'center', lineHeight: 1.8 }}>Every mentor at Enlift hub has cleared SSB, served in uniform, and in many cases sat as a GTO, IO, or Psychologist on an actual selection board.</p>
          </div>
          <div className="faculty-grid">
            {facultyData.map(f => (
              <div className="faculty-card" key={f.name}>
                <div className="faculty-img">
                  <div className="faculty-img-pattern" />
                  <span className="faculty-img-rank">{f.rank}</span>
                  {f.image ? (
                    <img src={f.image} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={64} color="rgba(255,255,255,0.12)" />
                  )}
                </div>
                <div className="faculty-body">
                  <div className="faculty-role">{f.role}</div>
                  <div className="faculty-name">{f.name}</div>
                  <div className="faculty-spec">{f.spec}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TALKS ── */}
      <section style={{ background: '#1A2A1B', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 className="sec-eyebrow" style={{ fontSize: '32px', letterSpacing: '0.15em', fontWeight: 800, color: '#C8A84B', marginBottom: 8 }}>
              IS ENLIFT HUB BEYOND THE CLASSROOM?
            </h1>
            <div className="rule" style={{ margin: '0 auto' }} />
          </div>
          {/* Subheading */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h3 className="sec-h2 sec-h2-white" style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>YES — PREPARATION AT ENLIFT HUB GOES FAR BEYOND STUDYING.</h3>
            <p className="sec-desc" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '1200px', margin: '0 auto', textAlign: 'center', lineHeight: 1.8 }}>At Enlift Hub, preparation is not limited to lectures or theory.
Future officers are shaped through experiences, conversations, and exposure to real military perspectives.
Through interactions with serving officers, assessors, and successful candidates, aspirants gain insights that no textbook can teach.</p>
          </div>
          {/* Cards - Single Line */}
          <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 24, overflowX: 'auto' }}>
            {talksCards.map(t => (
              <div key={t.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: 28, display: 'flex', gap: 16, alignItems: 'flex-start', minWidth: '280px', flex: '1 1 0%' }}>
                <div style={{ width: 44, height: 44, background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#C8A84B' }}><t.icon size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section className="courses sec">
        <div className="sec-inner">
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 className="sec-eyebrow" style={{ fontSize: '32px', letterSpacing: '0.15em', fontWeight: 800, color: '#C8A84B', marginBottom: 8 }}>THE COURSES WHICH MAKE YOU AN OFFICER</h1>
            <div className="rule" style={{ margin: '0 auto' }} />
          </div>
          {/* Subheading & Description */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div>
              <h3 className="sec-h2" style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: 16 }}>THE COURCES WHICH MAKE YOU AN OFFICER</h3>
            </div>
            <p className="sec-desc" style={{ color: '#0D1710', maxWidth: '800px', margin: '0 auto', textAlign: 'center', lineHeight: 1.8 }}>Every course is designed around real SSB demands — not generic defence coaching content.</p>
          </div>
          <div className="courses-grid">
            {courses.map((c, idx) => (
              <div className={`course-card${c.featured ? ' featured' : ''}${c.variant === 'secondary' ? ' course-card-secondary' : ''}${c.variant === 'tertiary' ? ' course-card-tertiary' : ''}`} key={c.name}>
                <span className="course-card-tag">{c.tag}</span>
                <div className="course-name">{c.name}</div>
                <div className="course-duration">{c.duration}</div>
                <div className="course-features">
                  {c.features.map((f, i) => (
                    <div className="course-feature" key={i}>
                      <CheckCircle2 size={14} className="course-feature-check" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="course-price-sub">Starting from</div>
                <div className="course-price">{c.price}</div>
                <Link to="/mentorship" className={c.featured ? 'btn-primary' : 'btn-outline'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: c.featured ? 'var(--ink)' : 'var(--army)', border: c.featured ? 'none' : '1.5px solid var(--army)' }}>
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YOUTUBE VIDEOS ── */}
      <section style={{ background: '#1A2A1B', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 className="sec-eyebrow" style={{ fontSize: '32px', letterSpacing: '0.15em', fontWeight: 800, color: '#C8A84B', marginBottom: 8 }}>
              HAVE YOU LISTENED TO OUR SUCCESSFUL CANDIDATES?
            </h1>
            <div className="rule" style={{ margin: '0 auto' }} />
          </div>
          {/* Subheading & Description */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h3 className="sec-h2" style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: 16, color: '#FFFFFF' }}>Real Experiences. Real Preparation. Real Results.</h3>
            <p className="sec-desc" style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '800px', margin: '0 auto', textAlign: 'center', lineHeight: 1.8 }}>Listen to candid conversations with SSB recommended candidates, aspirants, and cadets who share how they prepared, the challenges they faced, and what ultimately helped them succeed at the Services Selection Board.</p>
          </div>
          {/* Video Grid - 3 videos with navigation - Desktop */}
          <div className="video-carousel-desktop" style={{ marginBottom: 32, position: 'relative' }}>
            {/* Left Arrow */}
            <button 
              onClick={() => setCurrentVideoIndex((currentVideoIndex - 3 + videoIds.length) % videoIds.length)} 
              style={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(200,168,75,0.9)', color: '#0D1710', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ArrowLeft size={18} />
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {videoIds.slice(currentVideoIndex, currentVideoIndex + 3).map((videoId, idx) => (
                <div key={idx} style={{ aspectRatio: '16/9', background: '#0D1710', borderRadius: 8, overflow: 'hidden' }}>
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              ))}
            </div>
            {/* Right Arrow */}
            <button 
              onClick={() => setCurrentVideoIndex((currentVideoIndex + 3) % videoIds.length)} 
              style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(200,168,75,0.9)', color: '#0D1710', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ArrowRight size={18} />
            </button>
          </div>
          {/* Video Carousel - Mobile */}
          <div className="video-carousel-mobile" style={{ marginBottom: 32, display: 'none' }}>
            <div className="video-carousel">
              <div className="video-carousel-track" style={{ transform: `translateX(-${currentMobileVideoIndex * 100}%)` }}>
                {videoIds.map((videoId, idx) => (
                  <div className="video-carousel-slide" key={idx}>
                    <div style={{ aspectRatio: '16/9', background: '#0D1710', borderRadius: 8, overflow: 'hidden' }}>
                      <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                  </div>
                ))}
              </div>
              <button className="video-carousel-btn prev" onClick={() => setCurrentMobileVideoIndex((currentMobileVideoIndex - 1 + videoIds.length) % videoIds.length)}><ArrowLeft size={16} /></button>
              <button className="video-carousel-btn next" onClick={() => setCurrentMobileVideoIndex((currentMobileVideoIndex + 1) % videoIds.length)}><ArrowRight size={16} /></button>
              <div className="video-carousel-dots">
                {videoIds.map((_, idx) => (
                  <button key={idx} className={`video-carousel-dot ${idx === currentMobileVideoIndex ? 'active' : ''}`} onClick={() => setCurrentMobileVideoIndex(idx)} />
                ))}
              </div>
            </div>
          </div>
          {/* Channel Link Button */}
          <div style={{ textAlign: 'center' }}>
            <a href="https://www.youtube.com/@CadetAA/videos" target="_blank" rel="noopener noreferrer" style={{ background: '#C8A84B', color: '#0D1710', border: 'none', padding: '14px 32px', fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              View More Videos <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── ACCESS FREE PLATFORM ── */}
      <section style={{ background: '#000000', padding: '80px 32px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FFFFFF', letterSpacing: '0.05em', marginBottom: 16 }}>ACCESS FREE PLATFORM</h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', marginBottom: 32, lineHeight: 1.7 }}>Practice TAT, WAT, SRT & PPDT under real SSB timing. Unlimited attempts. Free for all registered candidates.</p>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#C8A84B', color: '#0D1710', padding: '16px 40px', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 4, transition: 'all 0.25s' }}>
            Start Free Practice <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── ENROLL CTA ── */}
      <section className="enroll">
        <div className="enroll-bg" />
        <div className="enroll-inner">
          <div className="enroll-kicker">
            Begin. <span>Train. Clear.</span>
          </div>
          <p className="enroll-sub">The candidates who get recommended are not the most talented — they are the most prepared. Begin your preparation today. The uniform is waiting.</p>
          <div className="enroll-actions">
            <Link to="/register" className="btn-primary" style={{ fontSize: 15, padding: '18px 48px', fontWeight: 600 }} onClick={() => trackEvent('cta_final')}>
              Enrol in a Batch <ArrowRight size={18} />
            </Link>
          </div>
          <p className="enroll-note">OFFLINE · ONLINE · DIGITAL — All preparation under one institute</p>
        </div>
      </section>

      <WhatsAppFloatButton />

      <FooterSection />
    </>
  );
}