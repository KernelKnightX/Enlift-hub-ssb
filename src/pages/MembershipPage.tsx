import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield,
  UserCheck,
  MessageCircle,
  ClipboardList,
  Target,
  Check,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useNavigate } from 'react-router';
import { NavbarSection } from '@/pages/navbar/NavbarSection';

interface FormData {
  name: string;
  email: string;
  phone: string;
  plan: string;
}

export default function MembershipPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [formData, setFormData] = useState<FormData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'mentorship_applications'), {
        ...formData,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      });
      
      alert('Thank you! Our mentor will contact you within 24 hours.');
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', plan: '' });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Thank you! Our mentor will contact you within 24 hours.');
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', plan: '' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarSection />
      
      {/* Full Width Header */}
      <div className="bg-slate-900 text-white py-12 px-6 pt-24">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 mb-6 -ml-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <Badge className="mb-4 bg-green-600">Limited Seats</Badge>
          <h1 className="text-4xl font-bold mb-4">1-to-1 SSB Mentorship Program</h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Personal guidance by experienced mentors to help you think, write, and respond 
            like a recommended candidate.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        
        {/* Features */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What You Will Get</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: UserCheck, title: 'Personal Mentor', desc: 'Dedicated expert' },
              { icon: MessageCircle, title: 'Daily Interaction', desc: 'WhatsApp & Calls' },
              { icon: ClipboardList, title: 'Answer Evaluation', desc: 'TAT, WAT, SRT, PPDT' },
              { icon: Target, title: 'Officer-Like Thinking', desc: 'OLQ Development' },
              { icon: Shield, title: 'Psych Test Mastery', desc: 'Psychology prep' },
              { icon: Check, title: 'Final SSB Strategy', desc: 'Interview & GTO' }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white p-4 rounded-lg border text-center">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                  <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pricing */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Choose Your Path</h2>
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* 1 Week Assessment */}
            <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
              <Badge variant="outline" className="mb-2">Quick Start</Badge>
              <h3 className="text-xl font-bold text-slate-900 mb-2">1-Week Assessment</h3>
              <p className="text-slate-600 text-sm mb-4">Evaluate your current level & get personalized roadmap</p>
              <p className="text-3xl font-bold text-blue-600 mb-1">₹2,999</p>
              <p className="text-xs text-slate-500 mb-4">7 Days • Diagnostic Focus</p>
              
              <ul className="space-y-2 mb-6 text-sm text-slate-600">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-0.5" /> Complete OLQ assessment</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-0.5" /> TAT, WAT, SRT evaluation</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-0.5" /> Personalized improvement plan</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-0.5" /> Daily mentor feedback</li>
              </ul>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleApply('1-Week Assessment - ₹2,999')}
              >
                Apply Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* 1 Month Complete */}
            <div className="bg-white p-6 rounded-lg border-2 border-purple-300 relative">
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <Badge className="mb-2 bg-purple-600">Complete Program</Badge>
              <h3 className="text-xl font-bold text-slate-900 mb-2">1-Month Mentorship</h3>
              <p className="text-slate-600 text-sm mb-4">Full transformation from basics to SSB-ready mindset</p>
              <p className="text-3xl font-bold text-purple-600 mb-1">₹9,999</p>
              <p className="text-xs text-slate-500 mb-4">30 Days • Complete Journey</p>
              
              <ul className="space-y-2 mb-6 text-sm text-slate-600">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-purple-600 mt-0.5" /> Everything in Assessment +</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-purple-600 mt-0.5" /> Daily practice & detailed reviews</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-purple-600 mt-0.5" /> Complete OLQ development</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-purple-600 mt-0.5" /> Interview & GTO preparation</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-purple-600 mt-0.5" /> WhatsApp & call support</li>
              </ul>

              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => handleApply('1-Month Complete - ₹9,999')}
              >
                Apply Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { num: '01', title: 'Apply', desc: 'Fill application form' },
              { num: '02', title: 'Get Matched', desc: 'Assigned expert mentor' },
              { num: '03', title: 'Daily Practice', desc: 'Work, submit, get feedback' },
              { num: '04', title: 'SSB Ready', desc: 'Clear with confidence' }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-slate-300 mb-2">{step.num}</div>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">Apply for Mentorship</h2>
            <p className="text-sm text-slate-500 mb-4">Our mentor will contact you within 24 hours.</p>
            <Badge className="mb-4">{selectedPlan}</Badge>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-lg"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-lg"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-lg"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
