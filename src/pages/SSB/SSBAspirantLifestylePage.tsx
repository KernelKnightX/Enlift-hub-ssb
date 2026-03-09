import { Link } from 'react-router';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';
import { ChevronRight, Clock, BookOpen, MessageSquare, Target, BarChart2, Users, Zap, Shield, GraduationCap } from 'lucide-react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .lifestyle-hero { 
    background: linear-gradient(135deg, #1A2A1B 0%, #243325 100%); 
    padding: 140px 32px 80px; 
    text-align: center; 
  }
  .lifestyle-hero h1 { 
    font-family: 'Bebas Neue', sans-serif; 
    font-size: clamp(2.5rem, 5vw, 4rem); 
    color: white; 
    letter-spacing: 0.05em; 
    margin-bottom: 16px; 
  }
  .lifestyle-hero p { 
    font-family: 'Cormorant Garamond', serif; 
    font-size: 1.25rem; 
    color: rgba(255,255,255,0.7); 
    max-width: 600px; 
    margin: 0 auto; 
    line-height: 1.6; 
  }
  .lifestyle-content { 
    background: #F5F0E8; 
    padding: 80px 32px; 
  }
  .lifestyle-inner { 
    max-width: 900px; 
    margin: 0 auto; 
  }
  .lifestyle-intro { 
    text-align: center; 
    margin-bottom: 64px; 
  }
  .lifestyle-intro h2 { 
    font-family: 'Bebas Neue', sans-serif; 
    font-size: 2rem; 
    color: #1A2A1B; 
    letter-spacing: 0.05em; 
    margin-bottom: 16px; 
  }
  .lifestyle-intro p { 
    color: #444; 
    line-height: 1.8; 
    font-size: 1.1rem; 
  }
  .schedule-section { 
    background: white; 
    padding: 48px; 
    margin-bottom: 48px; 
    border-left: 4px solid #C8A84B; 
  }
  .schedule-section h3 { 
    font-family: 'Bebas Neue', sans-serif; 
    font-size: 1.5rem; 
    color: #1A2A1B; 
    letter-spacing: 0.05em; 
    margin-bottom: 24px; 
  }
  .schedule-grid { 
    display: grid; 
    gap: 0; 
  }
  .schedule-item { 
    display: grid; 
    grid-template-columns: 100px 1fr; 
    gap: 24px; 
    padding: 20px 0; 
    border-bottom: 1px solid rgba(0,0,0,0.06); 
  }
  .schedule-item:last-child { border-bottom: none; }
  .schedule-time { 
    font-size: 11px; 
    font-weight: 700; 
    color: #C8A84B; 
    letter-spacing: 0.08em; 
    padding-top: 2px; 
  }
  .schedule-act { 
    font-size: 1rem; 
    font-weight: 600; 
    color: #1A2A1B; 
    margin-bottom: 6px; 
  }
  .schedule-why { 
    font-size: 0.9rem; 
    color: #6B7A6D; 
    line-height: 1.5; 
  }
  .habits-section { margin-bottom: 48px; }
  .habits-section h3 { 
    font-family: 'Bebas Neue', sans-serif; 
    font-size: 1.5rem; 
    color: #1A2A1B; 
    letter-spacing: 0.05em; 
    margin-bottom: 24px; 
    text-align: center;
  }
  .habits-grid { 
    display: grid; 
    grid-template-columns: repeat(2, 1fr); 
    gap: 24px; 
  }
  .habit-card { 
    background: white; 
    padding: 28px; 
    border: 1px solid rgba(0,0,0,0.06); 
  }
  .habit-card-icon { 
    width: 48px; 
    height: 48px; 
    background: rgba(200,168,75,0.1); 
    border: 1px solid rgba(200,168,75,0.2); 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: #C8A84B; 
    margin-bottom: 16px; 
  }
  .habit-card-title { 
    font-size: 1rem; 
    font-weight: 700; 
    color: #1A2A1B; 
    margin-bottom: 8px; 
  }
  .habit-card-desc { 
    font-size: 0.9rem; 
    color: #6B7A6D; 
    line-height: 1.6; 
  }
  .key-takeaways { 
    background: #1A2A1B; 
    padding: 48px; 
    margin-bottom: 48px; 
  }
  .key-takeaways h3 { 
    font-family: 'Bebas Neue', sans-serif; 
    font-size: 1.5rem; 
    color: #C8A84B; 
    letter-spacing: 0.05em; 
    margin-bottom: 24px; 
    text-align: center; 
  }
  .takeaways-list { list-style: none; padding: 0; }
  .takeaways-list li { 
    display: flex; 
    align-items: flex-start; 
    gap: 16px; 
    padding: 16px 0; 
    border-bottom: 1px solid rgba(255,255,255,0.1); 
    color: rgba(255,255,255,0.8); 
  }
  .takeaways-list li:last-child { border-bottom: none; }
  .takeaways-list li svg { color: #C8A84B; flex-shrink: 0; margin-top: 2px; }
  
  .cta-section { text-align: center; padding: 48px 0; }
  .cta-btn { 
    display: inline-flex; 
    align-items: center; 
    gap: 8px; 
    background: #C8A84B; 
    color: #0D1710; 
    padding: 16px 40px; 
    font-weight: 700; 
    text-decoration: none; 
    letter-spacing: 0.05em; 
    text-transform: uppercase; 
    font-size: 14px; 
    transition: all 0.2s;
  }
  .cta-btn:hover { 
    background: #E2C26A; 
    transform: translateY(-2px); 
  }

  @media (max-width: 768px) {
    .schedule-item { grid-template-columns: 1fr; gap: 8px; }
    .habits-grid { grid-template-columns: 1fr; }
  }
`;

const dailySchedule = [
  { time: '5:30 AM', act: 'Wake Up & Exercise', why: 'Physical fitness is non-negotiable. Run, do PT, or yoga. The early morning discipline sets the tone for the entire day.' },
  { time: '7:00 AM', act: 'Self-Assessment & Goal Setting', why: 'Rate yourself on each of the 15 OLQs. Write down 3 goals for the day. SSB looks for candidates with clear direction.' },
  { time: '8:00 AM', act: 'Breakfast & Current Affairs', why: 'Read The Hindu or Indian Express. Stay updated on defence, geopolitics, and national issues. This is crucial for interview.' },
  { time: '10:00 AM', act: 'Current Affairs Deep Dive', why: 'Make notes on one topic deeply. Understand the why behind events. Officers need broad awareness and depth.' },
  { time: '12:00 PM', act: 'Group Discussion Practice', why: 'Form a group or practice alone. Speak for 2-3 minutes on any topic. Record yourself and analyze.' },
  { time: '2:00 PM', act: 'Psychology Practice', why: 'TAT, WAT, SRT — your minds freshest hour is the best time to train instinctive responses under time pressure.' },
  { time: '4:00 PM', act: 'Sports / Physical Activity', why: 'Play cricket, football, or badminton. Leadership is shown in sports. Team activities demonstrate cooperation.' },
  { time: '6:00 PM', act: 'Reading & Vocabulary', why: 'Read newspapers, editorials, and books. Note down new words. Power of expression is an OLQ.' },
  { time: '8:00 PM', act: 'Self-Reflection Journal', why: 'Write what you did today. Rate your OLQ demonstration. Self-awareness is itself an OLQ — Effective Intelligence.' },
  { time: '10:00 PM', act: 'Lights Out', why: 'Sleep early. SSB days start early. Physical and mental freshness is assessed from the moment you enter.' },
];

const habits = [
  { icon: BookOpen, title: 'Read Military Biographies', desc: 'Sam Manekshaw, Field Marshal Cariappa, Param Vir Chakra recipients — their stories build the officer mindset.' },
  { icon: MessageSquare, title: 'Volunteer & Lead', desc: 'Organise events. Take initiative in group settings. Initiative is the first OLQ — practice it in daily life.' },
  { icon: Target, title: 'Journal Your Decisions', desc: 'Write down 3 decisions you made today and why. SSB looks for speed and quality of decision-making.' },
  { icon: BarChart2, title: 'Track Your Growth', desc: 'Rate yourself weekly on each OLQ. Growth in self-awareness is itself an OLQ — Effective Intelligence.' },
  { icon: Users, title: 'Join Team Activities', desc: 'Participate in college events, sports, NCC, or social service. Leadership and cooperation are demonstrated in teams.' },
  { icon: Zap, title: 'Practice Extempore', desc: 'Pick a random topic. Speak for 2 minutes. Record and review. Clear expression is crucial for SSB.' },
];

const keyTakeaways = [
  { icon: Clock, text: 'Discipline is non-negotiable. Wake up early, sleep early, and maintain a strict routine.' },
  { icon: Target, text: 'OLQs are developed, not faked. Work on them daily through conscious effort in everything you do.' },
  { icon: Users, text: 'Group activities demonstrate leadership and cooperation. Participate in team sports and events.' },
  { icon: GraduationCap, text: 'Current affairs and general knowledge are essential. Read newspapers daily and make notes.' },
  { icon: Shield, text: 'Physical fitness shows discipline. Maintain regular exercise and a healthy lifestyle.' },
  { icon: BarChart2, text: 'Self-awareness is key. Regular journaling and self-reflection help understand your strengths and weaknesses.' },
];

export default function SSBAspirantLifestylePage() {
  return (
    <div className="min-h-screen">
      <style>{css}</style>
      <NavbarSection />

      {/* Hero Section */}
      <div className="lifestyle-hero">
        <h1>How An SSB Aspirant Should Live</h1>
        <p>Your daily routine reflects your personality. The board doesn't just evaluate you during tests — they observe how you live your life.</p>
      </div>

      <div className="lifestyle-content">
        <div className="lifestyle-inner">
          
          {/* Introduction */}
          <div className="lifestyle-intro">
            <h2>Your Daily Routine Matters</h2>
            <p>
              OLQs don't appear on the day of SSB. They appear in how you live today. The candidate who leads his college team, 
              takes responsibility without being asked, helps a stranger without thinking twice — that candidate walks into SSB 
              already halfway there. The board's job is to confirm what you already are.
            </p>
          </div>

          {/* Daily Schedule */}
          <div className="schedule-section">
            <h3>A Productive Day</h3>
            <div className="schedule-grid">
              {dailySchedule.map((item, i) => (
                <div className="schedule-item" key={i}>
                  <div className="schedule-time">{item.time}</div>
                  <div>
                    <div className="schedule-act">{item.act}</div>
                    <div className="schedule-why">{item.why}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Habits */}
          <div className="habits-section">
            <h3>Essential Habits For SSB Aspirants</h3>
            <div className="habits-grid">
              {habits.map((habit, i) => (
                <div className="habit-card" key={i}>
                  <div className="habit-card-icon">
                    <habit.icon size={24} />
                  </div>
                  <div className="habit-card-title">{habit.title}</div>
                  <div className="habit-card-desc">{habit.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="key-takeaways">
            <h3>Key Principles To Remember</h3>
            <ul className="takeaways-list">
              {keyTakeaways.map((item, i) => (
                <li key={i}>
                  <item.icon size={20} />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="cta-section">
            <Link to="/register" className="cta-btn">
              Start Your Journey <ChevronRight size={18} />
            </Link>
          </div>

        </div>
      </div>

      <FooterSection />
    </div>
  );
}
