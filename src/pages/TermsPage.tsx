import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';
import { Link } from 'react-router';

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of terms',
    content: (
      <p>
        By creating an account or using Fauji Grid, you agree to these Terms &amp; Conditions. If you do not agree, please
        do not use the platform.
      </p>
    ),
  },
  {
    id: 'service',
    title: 'What we provide',
    content: (
      <p>
        Fauji Grid offers <strong className="font-semibold text-slate-800">computer-based mock tests</strong> for defence
        entrance examinations including NDA, CDS, and AFCAT. Features may include timed attempts, instruction sheets,
        response review, and attempt history tied to your account. We may add, change, or remove papers during the pilot
        without prior notice.
      </p>
    ),
  },
  {
    id: 'accounts',
    title: 'Your account',
    content: (
      <ul>
        <li>Provide accurate registration details (name, date of birth, contact, email).</li>
        <li>Keep your password confidential; you are responsible for activity under your account.</li>
        <li>One person per account — do not share credentials or create duplicate accounts to bypass access limits.</li>
        <li>Notify us promptly if you suspect unauthorised use.</li>
      </ul>
    ),
  },
  {
    id: 'conduct',
    title: 'Fair use',
    content: (
      <ul>
        <li>Use mocks for personal exam preparation only.</li>
        <li>Do not copy, scrape, redistribute, or resell questions, explanations, or interface content.</li>
        <li>Do not interfere with timers, scoring, payments, or platform security.</li>
        <li>Do not use automated tools to access the service without our written permission.</li>
      </ul>
    ),
  },
  {
    id: 'payments',
    title: 'Paid access',
    content: (
      <p>
        Some papers or bundles may require payment through our payment partner (e.g. Razorpay). Prices and what is
        included in a plan are shown at checkout. Unless required by law, fees for digital access are generally
        non-refundable once access is granted. Chargebacks or fraud may result in account suspension.
      </p>
    ),
  },
  {
    id: 'ip',
    title: 'Intellectual property',
    content: (
      <p>
        The Fauji Grid brand, software, and mock content are owned by us or our licensors. You receive a limited,
        personal, non-transferable licence to use the platform for preparation. You may not reverse-engineer or create
        derivative works from our materials.
      </p>
    ),
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer',
    content: (
      <p>
        Fauji Grid is an <strong className="font-semibold text-slate-800">independent practice tool</strong>. We are not
        affiliated with UPSC, the Indian Air Force, or any armed forces recruitment body. Mock papers are for practice
        only; we do not guarantee exam selection, ranks, or scores in real examinations.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    content: (
      <p>
        To the fullest extent permitted by law, Fauji Grid is not liable for indirect, incidental, or consequential
        damages, or for loss of data, profits, or opportunities arising from use of the service. The platform is provided
        &quot;as is&quot; without warranty of uninterrupted or error-free operation.
      </p>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: (
      <p>
        Our collection and use of personal data is described in the{' '}
        <Link to="/privacy">Privacy Policy</Link>. By using Fauji Grid, you acknowledge that policy.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    content: (
      <p>
        We may update these terms from time to time. The &quot;Updated&quot; date at the top will change when we do.
        Continued use after changes means you accept the revised terms.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDocumentLayout
      docType="terms"
      title="Terms & Conditions"
      updated="October 2026"
      intro="Rules for using Fauji Grid mock tests and related services. Please read them before you register or attempt a paper."
      sections={sections}
    />
  );
}
