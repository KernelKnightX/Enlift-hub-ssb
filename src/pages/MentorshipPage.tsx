import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';
import {
  Shield,
  UserCheck,
  MessageCircle,
  ClipboardList,
  Target,
  Star,
  Check,
  ArrowRight
} from 'lucide-react';

export default function MentorshipPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: ''
  });

  const handleApply = (plan: string) => {
    setSelectedPlan(plan);
    setFormData({ ...formData, plan });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you! Our mentor will contact you within 24 hours.');
    setShowForm(false);
    setFormData({ name: '', email: '', phone: '', plan: '' });
  };

  const features = [
    { icon: UserCheck, title: 'Personal Mentor', desc: 'Dedicated expert', color: 'from-blue-500 to-cyan-500' },
    { icon: MessageCircle, title: 'Daily Interaction', desc: 'WhatsApp & Calls', color: 'from-green-500 to-emerald-500' },
    { icon: ClipboardList, title: 'Answer Evaluation', desc: 'TAT, WAT, SRT, PPDT', color: 'from-purple-500 to-pink-500' },
    { icon: Target, title: 'Officer-Like Thinking', desc: 'OLQ Development', color: 'from-orange-500 to-red-500' },
    { icon: Shield, title: 'Psych Test Mastery', desc: 'Psychology prep', color: 'from-indigo-500 to-blue-500' },
    { icon: Star, title: 'Final SSB Strategy', desc: 'Interview & GTO', color: 'from-yellow-500 to-orange-500' }
  ];

  const steps = [
    { num: '01', title: 'Apply', desc: 'Fill simple application form', color: 'from-blue-500 to-cyan-500' },
    { num: '02', title: 'Get Matched', desc: 'Assigned expert mentor', color: 'from-purple-500 to-pink-500' },
    { num: '03', title: 'Daily Practice', desc: 'Work, submit, get feedback', color: 'from-orange-500 to-red-500' },
    { num: '04', title: 'SSB Ready', desc: 'Clear with confidence', color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1A2A1B 0%, #0D1710 100%)' }}>
      <NavbarSection />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* HERO */}
          <div className="text-center space-y-6 pt-8">
            <Badge className="px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
              🔥 Limited Seats Available
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              1-to-1 SSB <span style={{ color: '#C8A84B' }}>Mentorship</span> Program
            </h1>
            <p className="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
              Personal guidance by experienced mentors to help you think, write, and respond 
              like a recommended candidate. Build OLQs, master psychology tests, and develop 
              the mindset that clears SSB.
            </p>
          </div>

          {/* FEATURES */}
          <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-2xl font-semibold mb-8 text-center text-white">What You'll Get</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {features.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="text-center space-y-3 group cursor-pointer">
                    <div className="flex justify-center">
                      <div className={`p-3 bg-gradient-to-br ${item.color} rounded-full transform group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">{item.title}</h3>
                      <p className="text-xs text-white/50 mt-1">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PRICING */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-10 text-white">Choose Your Path</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* 1 WEEK ASSESSMENT */}
              <Card className="relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 opacity-10 rounded-bl-full"></div>
                <CardHeader className="space-y-4">
                  <Badge variant="outline" className="w-fit border-blue-500 text-blue-400">
                    Quick Start
                  </Badge>
                  <div>
                    <CardTitle className="text-2xl text-white">1-Week Assessment</CardTitle>
                    <CardDescription className="mt-2 text-white/50">
                      Evaluate your current level & get personalized roadmap
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-4xl font-bold" style={{ color: '#C8A84B' }}>
                      ₹2,999
                    </p>
                    <p className="text-sm text-white/50 mt-1">7 Days • Diagnostic Focus</p>
                  </div>
                  
                  <ul className="space-y-3">
                    {[
                      'Complete OLQ assessment',
                      'TAT, WAT, SRT evaluation',
                      'Personalized improvement plan',
                      'Daily mentor feedback',
                      'Baseline psychology review'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full bg-[#C8A84B] hover:bg-[#B8973F] text-black font-semibold border-0"
                    size="lg"
                    onClick={() => handleApply('1-Week Assessment - ₹2,999')}
                  >
                    Start Assessment <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <p className="text-xs text-center text-white/40">
                    Fill the form • Our mentor will contact you
                  </p>
                </CardContent>
              </Card>

              {/* 1 MONTH COMPLETE */}
              <Card className="relative overflow-hidden border-0" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 via-pink-500 to-orange-500 text-white px-6 py-2 text-xs font-bold shadow-lg rounded-bl-2xl">
                  ⭐ MOST POPULAR
                </div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-400 to-pink-400 opacity-10 rounded-tr-full"></div>
                <CardHeader className="space-y-4 pt-12">
                  <Badge className="w-fit bg-gradient-to-r from-purple-600 to-pink-600 border-0">
                    Complete Program
                  </Badge>
                  <div>
                    <CardTitle className="text-2xl text-white">1-Month Mentorship</CardTitle>
                    <CardDescription className="mt-2 text-white/50">
                      Full transformation from basics to SSB-ready mindset
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-4xl font-bold" style={{ color: '#C8A84B' }}>
                      ₹9,999
                    </p>
                    <p className="text-sm text-white/50 mt-1">30 Days • Complete Journey</p>
                  </div>
                  
                  <ul className="space-y-3">
                    {[
                      'Everything in Assessment +',
                      'Daily practice & detailed reviews',
                      'Complete OLQ development',
                      'Psychology test mastery',
                      'Interview & GTO preparation',
                      'Conference readiness',
                      'WhatsApp & call support'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 font-semibold"
                    size="lg"
                    onClick={() => handleApply('1-Month Complete - ₹9,999')}
                  >
                    Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <p className="text-xs text-center text-white/40">
                    Fill the form • Limited candidates • Mentor contacts after approval
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* HOW IT WORKS */}
          <div className="rounded-2xl p-8 md:p-12" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-2xl font-bold text-center mb-8 text-white">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {steps.map((step, i) => (
                <div key={i} className="text-center space-y-3">
                  <div className={`text-5xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-white/50">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <FooterSection />

      {/* APPLICATION FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full shadow-2xl" style={{ background: '#1A2A1B', border: '1px solid rgba(255,255,255,0.1)' }}>
            <CardHeader>
              <CardTitle className="text-2xl text-white">Apply for Mentorship</CardTitle>
              <CardDescription className="text-white/50">
                Fill in your details. Our mentor will contact you within 24 hours.
              </CardDescription>
              <Badge className="w-fit mt-2 bg-gradient-to-r from-blue-600 to-purple-600 border-0">
                {selectedPlan}
              </Badge>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/70">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full mt-1 px-4 py-2 rounded-lg border bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-[#C8A84B] focus:border-transparent outline-none"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/70">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full mt-1 px-4 py-2 rounded-lg border bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-[#C8A84B] focus:border-transparent outline-none"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/70">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="w-full mt-1 px-4 py-2 rounded-lg border bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-[#C8A84B] focus:border-transparent outline-none"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#C8A84B] hover:bg-[#B8973F] text-black border-0 font-semibold"
                  >
                    Submit Application
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
