/**
 * WPPConnect WhatsApp Bot for Enlift Hub
 * 
 * FREE WhatsApp Bot with Auto-Reply Functionality
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install Node.js from https://nodejs.org
 * 2. Run: npm install wppconnect
 * 3. Run: node wppconnect-bot.js
 * 4. Scan QR code with WhatsApp
 * 5. Bot will be live!
 * 
 * DEPLOY ON RAILWAY (FREE):
 * 1. Push code to GitHub
 * 2. Create Railway account
 * 3. Connect GitHub repo
 * 4. Deploy - bot runs 24/7
 */

const wpp = require('@wppconnect-team/wppconnect');

// Auto-reply responses for Enlift Hub
const responses = {
  // Course related queries
  course: `📚 *Enlift Hub Courses:*

• *SSB Residential Program* - ₹45,000
  - 28 days intensive offline coaching
  - 10 candidates per batch
  - Full SSB simulation

• *Online SSB Mentorship* - ₹15,000
  - Live classes daily
  - 20 candidates per batch
  - Expert guidance

• *Digital Psychology Platform* - ₹2,999
  - Unlimited TAT, WAT, SRT, PPDT
  - Real SSB timing
  - Instant feedback

Reply with the course name for more details!`,
  
  fees: `💰 *Fee Structure:*

• Residential Program: *₹45,000*
• Online Mentorship: *₹15,000*
• Digital Platform: *₹2,999*
• Combined Package: *₹55,000*

*Installments available!*

Need help choosing? Chat with our counselors!`,
  
  // SSB Process
  ssb: `🎖️ *SSB Selection Process:*

*Day 1-2: Screening*
• PPDT (Picture Perception)
• WAT (Word Association Test)
• OIR (Officer Intelligence Rating)

*Day 3-5: Psychology Tests*
• TAT (Thematic Apperception Test)
• SRT (Situation Reaction Test)
• WAT (with better scoring)

*Day 6-7: GTO*
• Group Discussion
• Group Planning
• Progressive Dash
• Snake Race
• Half Group Task
• Full Group Task
• Personal Interview

*Day 8: Conference*
• Final results announced

Need guidance for any stage?`,
  
  // Online/Mentorship
  online: `💻 *Online SSB Mentorship:*

✓ Daily 4-hour live sessions
✓ Expert ex-defence instructors
✓ Doubt clearing sessions
✓ Mock tests with analysis
✓ Study materials provided
✓ 20 candidates per batch

*Batch starts every month!*

For fees: Reply with "fees"
To apply: Reply with "apply"`,
  
  // Residential
  residential: `🏠 *SSB Residential Program:*

✓ 28 days intensive offline
✓ Only 10 candidates per batch
✓ Full GTO ground training
✓ Psychology lab sessions
✓ Mock PI panels
✓ Medical guidance

*Location: [Your City]*

Fees: ₹45,000 (incl. all)

To apply: Reply with "apply"`,
  
  // Digital Platform
  digital: `📱 *Digital Psychology Platform:*

✓ Unlimited practice tests
✓ TAT, WAT, SRT, PPDT
✓ Real SSB timing (4 min per image)
✓ Instant scoring & feedback
✓ Compare with other candidates
✓ All questions covered

*Price: ₹2,999 (lifetime access)*

Want to try free? Reply with "demo"`,
  
  // Contact
  contact: `📞 *Contact Enlift Hub:*

*WhatsApp:* +91 86380 75112
*Email:* info@enlifthub.com
*Website:* enlifthub.com

*Office Hours:* 9 AM - 7 PM

We're here to help!`,
  
  // Apply
  apply: `✅ *Application Process:*

1. Fill the form: enlifthub.com/register
2. Clear entrance assessment
3. Join your chosen program

*Assessment is FREE!*

Need help? Chat with our team!`,
  
  // Default
  default: `🙏 *Welcome to Enlift Hub!*

We're India's top SSB preparation platform.

What would you like to know?

• Courses & Fees
• SSB Process
• Online/Offline Programs
• How to Apply
• Contact Details

Reply with any keyword above!`
};

// Keywords mapping
const keywords = {
  course: ['course', 'courses', 'program', 'programs', 'batch', 'coaching'],
  fees: ['fees', 'fee', 'price', 'cost', '₹', 'rupee', 'discount', 'offer'],
  ssb: ['ssb', 'screening', 'interview', 'selection', 'defence', 'army', 'navy', 'air force'],
  online: ['online', 'live', 'mentorship', 'virtual', 'remote', 'zoom', 'class'],
  residential: ['residential', 'offline', 'classroom', 'physical', 'ground', 'hostel'],
  digital: ['digital', 'practice', 'psychology', 'test', 'tat', 'wat', 'srt', 'ppdt', 'platform'],
  contact: ['contact', 'phone', 'email', 'address', 'location', 'whatsapp'],
  apply: ['apply', 'enroll', 'join', 'admission', 'register', 'start']
};

function getResponse(message) {
  const lower = message.toLowerCase();
  
  // Check for exact keywords first
  for (const [key, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (lower.includes(word)) {
        return responses[key];
      }
    }
  }
  
  return responses.default;
}

// Create the bot
wpp.create({
  session: 'enlift-hub-bot',
  multiDevice: true,
  browserArgs: ['--no-sandbox']
}).then((client) => {
  console.log('✅ Enlift Hub WhatsApp Bot Started!');
  console.log('📱 Waiting for messages...');
  
  client.onMessage((message) => {
    console.log(`📩 Message from ${message.from}: ${message.body}`);
    
    // Don't reply to group messages
    if (message.isGroupMsg) return;
    
    // Get response based on message
    const response = getResponse(message.body);
    
    // Send reply
    client.sendText(message.from, response).then(() => {
      console.log(`✅ Reply sent to ${message.from}`);
    }).catch((err) => {
      console.error('❌ Error sending reply:', err);
    });
  });
  
  // Handle disconnect
  client.onDisconnected((reason) => {
    console.log('❌ Bot disconnected:', reason);
    console.log('🔄 Restarting bot...');
    process.exit(1);
  });
  
}).catch((err) => {
  console.error('❌ Error creating bot:', err);
});
