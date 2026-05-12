import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, FileText, ArrowRight } from 'lucide-react';

export default function SubscriptionSuccessPage() {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Get stored email
    const storedEmail = localStorage.getItem('magazine_subscriber_email') || '';
    setEmail(storedEmail);
    
    // Clear storage
    localStorage.removeItem('magazine_subscription_success');
    localStorage.removeItem('magazine_subscriber_email');
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <Card className="max-w-md mx-auto border-0 shadow-2xl">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Subscription Successful!
            </h1>
            
            <p className="text-slate-600 mb-6">
              Thank you for subscribing to Enlift Hub's Current Affairs Magazine.
            </p>

            {email && (
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">{email}</span>
                </div>
                <p className="text-sm text-green-600 mt-2">
                  Your daily magazine will be sent to this email address.
                </p>
              </div>
            )}

            <div className="space-y-3 text-sm text-slate-600 mb-8">
              <div className="flex items-center gap-3 justify-start p-3 bg-slate-50 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
                <span>Daily PDF magazines delivered to your email</span>
              </div>
              <div className="flex items-center gap-3 justify-start p-3 bg-slate-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Stay updated with latest current affairs</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                asChild 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Link to="/">
                  Go to Home <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              
              <p className="text-xs text-slate-500">
                Need help? Contact us at support@enlifithub.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
