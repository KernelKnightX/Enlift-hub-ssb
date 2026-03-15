# FREE WhatsApp Integration for Enlift Hub

## ✅ Implemented: WhatsApp Floating Button

A free floating WhatsApp button has been added to:
- Landing Page
- Mentorship Page  
- Membership Page

**Phone Number:** +91 86380 75112

---

## What are the Free Options?

### Option 1: WhatsApp Click-to-Chat (IMPLEMENTED) ✅
**Cost:** FREE | **Setup:** Done

This is what we implemented - a simple button that opens WhatsApp with a pre-filled message. Users click it and WhatsApp opens with your number and message ready.

```html
<a href="https://wa.me/918638075112?text=Hi, I'm interested...">
  Chat on WhatsApp
</a>
```

**Pros:** ✅ Instant, no server needed, works on all devices
**Cons:** ❌ No auto-reply, manual response needed

---

### Option 2: Google Sheets + Apps Script (Free Automation)
**Cost:** FREE | **Setup:** 15 minutes

This creates an auto-responder using Google's free tools:

1. **Create Google Sheet** with columns: Timestamp, Name, Phone, Query, Status

2. **Create Apps Script** (Extensions → Apps Script):

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  const data = JSON.parse(e.postData.contents);
  
  // Save query to sheet
  sheet.appendRow([new Date(), data.name, data.phone, data.message, 'New']);
  
  // Send auto-reply (limited)
  return ContentService.createTextOutput(JSON.stringify({
    reply: "Thank you! We'll respond shortly."
  })).setMimeType(ContentService.MimeType.JSON);
}
```

3. **Deploy** as Web App

**Pros:** ✅ Free, stores all queries, auto-responds
**Cons:** ❌ Limited to Google quotas, no real bot functionality

---

### Option 3: WPPConnect (Self-Hosted Bot)
**Cost:** FREE | **Setup:** 30 minutes

Run your own WhatsApp bot using Node.js:

```bash
# Install
npm install wppconnect

# Create bot.js
const wpp = require('wppconnect');

wpp.create().then(client => {
  client.onMessage(message => {
    const text = message.body.toLowerCase();
    
    if (text.includes('course') || text.includes('fees')) {
      client.sendText(message.from, 
        "📚 Enlift Hub Courses:\n" +
        "• SSB Residential: ₹45,000\n" +
        "• Online Mentorship: ₹15,000\n" +
        "• Digital Platform: ₹2,999\n\n" +
        "Visit: enlifthub.com/mentorship"
      );
    } else if (text.includes('ssb')) {
      client.sendText(message.from, 
        "🎖️ SSB Process:\n" +
        "1. Screening (PPDT+WAT+OIR)\n" +
        "2. Psychology Tests\n" +
        "3. GTO Tasks\n" +
        "4. Personal Interview"
      );
    } else {
      client.sendText(message.from, 
        "🙏 Thank you for contacting Enlift Hub!\n" +
        "Our team will respond within 24 hours."
      );
    }
  });
});
```

**Run:**
```bash
node bot.js
```

**Deploy on Railway/Render (free tier):**
- Push code to GitHub
- Connect to Railway/Render
- Set environment variables
- Deploy

**Pros:** ✅ Full bot functionality, free, unlimited messages
**Cons:** ❌ Requires server hosting, needs phone pairing

---

### Option 4: 24API.in (Free WhatsApp API)
**Cost:** FREE* (limited) | **Setup:** 10 minutes

1. Sign up at https://24api.in
2. Get free API key
3. Send messages:

```javascript
const response = await fetch('https://24api.in/whatsapp/send', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    phone: '918638075112',
    message: 'New enquiry from website'
  })
});
```

**Pros:** ✅ Simple API, no server needed
**Cons:** ❌ Free tier has limits (50 msgs/day), may not work reliably

---

## Comparison

| Method | Cost | Auto-Reply | Hosting | Difficulty |
|--------|------|------------|---------|------------|
| Click-to-Chat | FREE | ❌ | ❌ | Easy |
| Google Sheets | FREE | ✅ | ❌ | Medium |
| WPPConnect | FREE | ✅ | ✅ | Hard |
| 24API.in | FREE* | ✅ | ❌ | Easy |
| Twilio | ₹0.30/msg | ✅ | ✅ | Medium |
| Meta API | ₹0.20/msg | ✅ | ✅ | Medium |

---

## Current Implementation

The website uses **Option 1 (Click-to-Chat)** which is:
- ✅ Completely free
- ✅ Instant setup
- ✅ No maintenance
- ✅ Reliable

Users click the floating green WhatsApp button → Opens WhatsApp with pre-filled message → You respond manually.

---

## To Upgrade to Auto-Reply

If you want auto-replies later, we can implement **Option 3 (WPPConnect)** which:
- Runs 24/7 on a free server
- Automatically responds to common queries
- Stores all messages in a database

Would you like me to set up WPPConnect for full automation?
