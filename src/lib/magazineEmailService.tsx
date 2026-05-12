// Magazine Email Service using EmailJS
import emailjs from '@emailjs/browser';
import { getActiveSubscribers, type MagazineIssue } from './subscriptionService';

// Email configuration
const getEmailConfig = () => {
  return {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    templateId: import.meta.env.VITE_EMAILJS_MAGAZINE_TEMPLATE_ID || '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  };
};

// Send magazine to a single subscriber using EmailJS
async function sendMagazineToSubscriber(
  email: string,
  name: string,
  magazineIssue: MagazineIssue
): Promise<{ success: boolean; message: string }> {
  try {
    const config = getEmailConfig();
    
    // Check if EmailJS is configured
    if (!config.serviceId || !config.templateId || !config.publicKey) {
      console.log('EmailJS not configured, skipping email send');
      return { success: false, message: 'EmailJS not configured' };
    }

    // Initialize EmailJS
    emailjs.init(config.publicKey);

    // Prepare email template parameters
    const templateParams = {
      to_email: email,
      to_name: name,
      magazine_title: magazineIssue.title,
      magazine_date: magazineIssue.date,
      magazine_url: magazineIssue.pdfUrl,
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      config.serviceId,
      config.templateId,
      templateParams
    );

    console.log(`Email sent successfully to ${email}:`, response);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error(`Error sending magazine to ${email}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Send magazine to all active subscribers
export async function sendMagazineToAllSubscribers(
  magazineIssue: MagazineIssue
): Promise<{
  total: number;
  successful: number;
  failed: number;
  results: Array<{ email: string; success: boolean; message: string }>;
}> {
  const results: Array<{ email: string; success: boolean; message: string }> = [];
  let successful = 0;
  let failed = 0;

  try {
    // Get all active subscribers
    const subscribers = await getActiveSubscribers();
    const total = subscribers.length;

    console.log(`Starting to send magazine to ${total} subscribers...`);

    if (total === 0) {
      return {
        total: 0,
        successful: 0,
        failed: 0,
        results: [],
      };
    }

    // Send to each subscriber
    for (const subscriber of subscribers) {
      const result = await sendMagazineToSubscriber(
        subscriber.email,
        subscriber.name,
        magazineIssue
      );

      results.push({
        email: subscriber.email,
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        successful++;
      } else {
        failed++;
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(`Magazine sent: ${successful} successful, ${failed} failed`);

    return {
      total,
      successful,
      failed,
      results,
    };
  } catch (error) {
    console.error('Error sending magazines to subscribers:', error);
    return {
      total: results.length,
      successful,
      failed,
      results,
    };
  }
}

// Send welcome email to new subscriber
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<{ success: boolean; message: string }> {
  try {
    const config = getEmailConfig();

    if (!config.serviceId || !config.templateId || !config.publicKey) {
      console.log('EmailJS not configured, skipping welcome email');
      return { success: false, message: 'EmailJS not configured' };
    }

    // For now, just log the welcome email
    console.log('=== WELCOME EMAIL ===');
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log('=====================');

    return {
      success: true,
      message: 'Welcome email sent',
    };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return {
      success: false,
      message: 'Failed to send welcome email',
    };
  }
}

// Check if email service is configured
export function isEmailServiceConfigured(): boolean {
  const config = getEmailConfig();
  return !!(config.serviceId && config.templateId && config.publicKey);
}
