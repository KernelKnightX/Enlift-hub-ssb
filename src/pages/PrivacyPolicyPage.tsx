import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';
import { Link } from 'react-router';

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    content: (
      <p>
        This Privacy Policy explains how Fauji Grid (&quot;we&quot;, &quot;us&quot;) handles information when you visit
        our website, register, take mock tests, or make purchases. We keep practices proportionate to a pilot mock-test
        platform focused on NDA, CDS, and AFCAT practice.
      </p>
    ),
  },
  {
    id: 'collect',
    title: 'Information we collect',
    content: (
      <>
        <p className="mb-2">Depending on how you use the site, we may collect:</p>
        <ul>
          <li>
            <strong className="font-semibold text-slate-800">Account data:</strong> name, date of birth, email, phone
            number, and password (stored securely via our authentication provider).
          </li>
          <li>
            <strong className="font-semibold text-slate-800">Usage data:</strong> mock attempts, scores, time spent,
            and pages visited — to show your history and improve the product.
          </li>
          <li>
            <strong className="font-semibold text-slate-800">Payment data:</strong> transactions are processed by
            Razorpay; we receive confirmation and metadata (not full card details stored on our servers).
          </li>
          <li>
            <strong className="font-semibold text-slate-800">Technical data:</strong> browser type, device, and
            approximate logs needed for security and debugging.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'use',
    title: 'How we use information',
    content: (
      <ul>
        <li>Create and manage your account.</li>
        <li>Deliver mock tests, save attempts, and show analysis.</li>
        <li>Process payments and unlock paid papers or plans.</li>
        <li>Send service-related messages (e.g. password reset) — not marketing spam without consent.</li>
        <li>Protect against abuse, fraud, and technical issues.</li>
        <li>Improve content and user experience during our pilot phase.</li>
      </ul>
    ),
  },
  {
    id: 'share',
    title: 'When we share data',
    content: (
      <p>
        We do not sell your personal information. We may share data with trusted processors who help us run the
        service — for example cloud hosting, authentication (Firebase), and payments (Razorpay) — only as needed to
        perform their role and subject to appropriate safeguards. We may disclose information if required by law or to
        protect rights and safety.
      </p>
    ),
  },
  {
    id: 'storage',
    title: 'Storage & security',
    content: (
      <p>
        Data may be stored on secure cloud infrastructure. We use reasonable technical and organisational measures, but
        no online system is 100% secure. Please use a strong password and log out on shared devices.
      </p>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep data',
    content: (
      <p>
        We retain account and attempt data while your account is active and for a reasonable period afterward for
        backups, legal compliance, or dispute resolution. You may request deletion of your account by contacting us;
        some records may be retained where the law requires.
      </p>
    ),
  },
  {
    id: 'rights',
    title: 'Your choices & rights',
    content: (
      <ul>
        <li>Update profile details from your account where available, or contact support.</li>
        <li>Request access, correction, or deletion of personal data (subject to legal limits).</li>
        <li>Opt out of non-essential communications.</li>
      </ul>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies & local storage',
    content: (
      <p>
        We use cookies and browser storage (including local storage) to keep you signed in, remember preferences, and
        store session state during tests. You can control cookies in your browser; disabling them may break login or
        test functionality.
      </p>
    ),
  },
  {
    id: 'children',
    title: 'Minors',
    content: (
      <p>
        Our service is aimed at exam aspirants. If you are under 18, use the platform with a parent or guardian&apos;s
        knowledge. We do not knowingly collect data from children without appropriate consent.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Policy updates',
    content: (
      <p>
        We may revise this policy as the product grows. Material changes will be reflected in the updated date above.
        Continued use after changes constitutes acceptance.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    content: (
      <p>
        For privacy questions or requests, email{' '}
        <a href="mailto:support@faujigrid.com">support@faujigrid.com</a>. See also our{' '}
        <Link to="/terms">Terms &amp; Conditions</Link>.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout
      docType="privacy"
      title="Privacy Policy"
      updated="October 2026"
      intro="How Fauji Grid collects, uses, and protects your information when you use our mock test platform."
      sections={sections}
    />
  );
}
