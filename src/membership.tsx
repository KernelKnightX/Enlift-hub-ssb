import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Shield,
  UserCheck,
  MessageCircle,
  ClipboardList,
  Target,
  Star,
  CheckCircle,
  X
} from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export default function MembershipPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    goal: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'mentorship_applications'), {
        ...formData,
        userId: user?.id || null,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: UserCheck,
      title: 'Personal Mentor',
      desc: 'Assigned mentor for complete SSB journey'
    },
    {
      icon: MessageCircle,
      title: 'Daily Interaction',
      desc: 'WhatsApp / Call based feedback & discussion'
    },
    {
      icon: ClipboardList,
      title: 'Answer Evaluation',
      desc: 'Detailed review of TAT, WAT, SRT & PPDT'
    },
    {
      icon: Target,
      title: 'Officer-Like Thinking',
      desc: 'Develop OLQs & structured response approach'
    },
    {
      icon: Shield,
      title: 'Psych Test Mastery',
      desc: 'Real SSB-oriented psychology preparation'
    },
    {
      icon: Star,
      title: 'Final SSB Strategy',
      desc: 'Interview, GTO & conference readiness'
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/10 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for applying to the Mentorship Program. Our team will contact you within 24 hours.
            </p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10">
      {/* Close button when form is open */}
      {showForm && (
        <button
          onClick={() => setShowForm(false)}
          className="fixed top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">

        {/* HERO */}
        <div className="text-center space-y-4">
          <Badge className="mx-auto">Limited Seats</Badge>
          <h1 className="text-4xl font-bold">
            1-to-1 SSB Mentorship Program
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Personal guidance by experienced mentors to help you
            think, write, and respond like a recommended candidate.
          </p>
        </div>

        {/* Application Form Modal */}
        {showForm ? (
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>Apply for Mentorship</CardTitle>
              <CardDescription>
                Fill in your details and we'll contact you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Your Goal / Current Status</Label>
                  <Textarea
                    id="goal"
                    placeholder="Tell us about your SSB preparation goal..."
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* FEATURES */}
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Card key={i}>
                    <CardHeader>
                      <Icon className="w-8 h-8 text-primary mb-2" />
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            {/* HOW IT WORKS */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>Simple & focused mentorship flow</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="grid md:grid-cols-4 gap-4 text-sm">
                  <li>1️⃣ Apply for mentorship</li>
                  <li>2️⃣ Mentor assignment</li>
                  <li>3️⃣ Daily practice & review</li>
                  <li>4️⃣ SSB-ready mindset</li>
                </ol>
              </CardContent>
            </Card>

            {/* PRICING */}
            <div className="flex justify-center">
              <Card className="max-w-md w-full border-2 border-primary">
                <CardHeader className="text-center">
                  <Badge className="mb-2">Most Popular</Badge>
                  <CardTitle>1-to-1 Mentorship</CardTitle>
                  <CardDescription>Complete SSB Guidance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                  <p className="text-4xl font-bold">₹9,999</p>
                  <p className="text-sm text-muted-foreground">
                    Duration: 30 Days • Limited Candidates Only
                  </p>
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={() => setShowForm(true)}
                  >
                    Apply Now
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Mentor will contact you after application
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
