import { Button } from '@/components/ui/button';
import { MessageSquare, Share2 } from 'lucide-react';

// ============= ANALYTICS =============
const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
    console.log('📊 Event:', eventName, properties);
  }
};

export function SocialShareSection() {
  return (
    <section className="py-16 px-6 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-3">Help a friend prepare for SSB</h3>
        <p className="text-muted-foreground mb-6">
          Share this platform and help them reduce anxiety. Practice helps everyone.
        </p>
        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              trackEvent('social_share', { platform: 'whatsapp' });
              window.open(
                `https://wa.me/?text=Check out Enlift hub - defence guidance & practice platform! ${window.location.href}`,
                '_blank'
              );
            }}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              trackEvent('social_share', { platform: 'generic' });
              if (navigator.share) {
                navigator.share({
                  title: 'Enlift hub',
                  text: 'Practice defence psychology tests!',
                  url: window.location.href,
                });
              }
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </section>
  );
}
