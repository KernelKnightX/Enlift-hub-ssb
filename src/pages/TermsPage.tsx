import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link to="/register" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Registration
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <img src="/AbhyasSSB.png" alt="Enlift hub" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Terms & Conditions</h1>
          <p className="text-muted-foreground mt-2">Last updated: February 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Enlift hub, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground">
              Enlift hub is a practice platform designed to help SSB (Services Selection Board) aspirants prepare for psychology tests including PPDT, TAT, WAT, and SRT. The platform provides timed practice sessions and performance tracking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
            <p className="text-muted-foreground">
              Users must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Usage Guidelines</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Use the platform only for legitimate SSB preparation purposes</li>
              <li>Do not share or distribute practice content to others</li>
              <li>Do not attempt to manipulate or circumvent the practice timing system</li>
              <li>Do not create multiple accounts to gain unfair practice advantages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content provided on Enlift hub, including practice questions, images, and materials, are the intellectual property of Enlift hub. Users may not reproduce, distribute, or use this content for commercial purposes without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Disclaimer</h2>
            <p className="text-muted-foreground">
              Enlift hub is a practice tool only. We do not guarantee SSB recommendation or selection. The practice materials are designed to simulate SSB conditions but do not represent actual SSB examination content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Enlift hub shall not be liable for any indirect, incidental, special, or consequential damages arising out of the use of this platform. We do not warrant that the service will be uninterrupted or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Privacy Policy</h2>
            <p className="text-muted-foreground">
              Your use of Enlift hub is also governed by our Privacy Policy. By using this platform, you consent to the collection and use of your information as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Modifications to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of the platform after any modifications constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms & Conditions, please contact us at support@enlifthub.com
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
          <p>© 2026 Enlift hub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
