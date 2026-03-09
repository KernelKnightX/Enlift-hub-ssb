import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Users,
  Award,
  Clock,
  GraduationCap,
} from 'lucide-react';

const heroSlides = [
  {
    badge: "SSB Psychology Practice",
    title: "Recommendation begins with",
    highlight: "Enlift hub",
    subtitle: "Train your self perfect for SSB.",
    description: "Practice TAT, WAT, SRT & PPDT under real SSB conditions with us.",
  },
  {
    badge: "Your Gateway to Defense Services",
    title: "Your Gateway to",
    highlight: "Defense Services",
    subtitle: "",
    description: "We don't just train candidates. We shape officers with the right attitude, knowledge, and confidence to serve the nation.",
  },
];

const stats = [
  { icon: Users, value: "50+", label: "Candidates Recommended" },
  { icon: Award, value: "85%", label: "Success Rate" },
  { icon: Clock, value: "2+", label: "Years Experience" },
  { icon: GraduationCap, value: "10+", label: "Expert Mentors" },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 text-white relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/Abhyas_ssb.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/80" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="max-w-5xl text-center relative z-10 py-20">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-green-500/10 border border-green-500/30 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-700">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-300">{slide.badge}</span>
        </div>

        {/* Main Headline */}
        <h1 
          key={currentSlide}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          {slide.title}
          <br />
          <span className="text-green-400">{slide.highlight}.</span>
        </h1>

        {/* Subheadline */}
        <p 
          key={`desc-${currentSlide}`}
          className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700"
        >
          {slide.subtitle && (
            <>
              {slide.subtitle}
              <br />
            </>
          )}
          <span className="text-slate-400">{slide.description}</span>
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-in fade-in duration-700 delay-400">
          <Button
            size="lg"
            className="px-8 py-5 bg-green-600 hover:bg-green-700 group shadow-lg shadow-green-900/50 hover:shadow-xl transition-all text-base"
            asChild
          >
            <Link to="/register">
              Start Practice
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="text-center animate-in fade-in duration-700 delay-500 mb-12">
          <Button
            variant="link"
            className="text-slate-400 hover:text-white text-base"
            asChild
          >
            <Link to="/login">
              Already have an account? Login →
            </Link>
          </Button>
        </div>

        {/* Stats - New Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in duration-700 delay-600 max-w-4xl mx-auto">
          {stats.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <item.icon className="w-6 h-6 text-green-400" />
              <span className="text-2xl font-bold text-white">{item.value}</span>
              <span className="text-sm text-slate-300">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === i ? 'bg-green-400 w-8' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/50" />
      </div>
    </section>
  );
}
