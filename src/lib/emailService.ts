// Email service for sending custom password reset emails
// This can be configured to use EmailJS, SendGrid, Resend, or any email provider

// Get the app's base URL for generating reset links
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return import.meta.env.VITE_APP_URL || 'https://abhyassb.com';
};

// Send custom password reset email
// this to use your preferred email service
// Options: Email In production, configureJS, SendGrid, Resend, AWS SES, etc.
export async function sendCustomPasswordResetEmail(
  email: string, 
  resetToken: string,
  userName?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const resetLink = `${getBaseUrl()}/reset-password?token=${resetToken}`;
    
    // Check for EmailJS configuration
    const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const emailjsTemplateId = import.meta.env.VITE_EMAILJS_PASSWORD_RESET_TEMPLATE_ID;
    const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // If EmailJS is configured, use it
    if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
      // Use fetch to call an API endpoint that handles EmailJS
      // Or install @emailjs/browser: npm install @emailjs/browser
      const response = await fetch('/api/send-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          resetLink,
          userName
        })
      }).catch(() => null);

      if (response?.ok) {
        return { success: true, message: 'Password reset email sent successfully' };
      }
    }

    // Development fallback: log the reset link
    // In production, you MUST configure an email service
    console.log('=== PASSWORD RESET EMAIL (Development Mode) ===');
    console.log(`To: ${email}`);
    console.log(`Name: ${userName || 'User'}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log('=================================================');
    console.log('\n⚠️  Configure email service in .env for production:');
    console.log('   VITE_EMAILJS_SERVICE_ID');
    console.log('   VITE_EMAILJS_PASSWORD_RESET_TEMPLATE_ID');
    console.log('   VITE_EMAILJS_PUBLIC_KEY');
    console.log('');
    console.log('Or set up a backend API endpoint at /api/send-password-reset');
    console.log('');
    
    return { 
      success: true, 
      message: 'Password reset link generated. In production, this would be sent via email.' 
    };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    
    // Log the link anyway for debugging
    const resetLink = `${getBaseUrl()}/reset-password?token=${resetToken}`;
    console.log(`Reset Link for ${email}: ${resetLink}`);
    
    return { 
      success: true, 
      message: 'Password reset link generated' 
    };
  }
}

// Utility to validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
