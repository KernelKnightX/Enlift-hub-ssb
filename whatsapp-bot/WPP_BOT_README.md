# 🤖 WPPConnect WhatsApp Bot for Enlift Hub

A **FREE** WhatsApp bot with auto-reply functionality!

## What is WPPConnect?

WPPConnect is an open-source library that lets you run a WhatsApp bot using Node.js. It connects your WhatsApp account through a browser session and lets you send/receive messages automatically.

## Features

✅ Auto-reply to common queries  
✅ 24/7 availability  
✅ No per-message costs  
✅ Custom responses for Enlift Hub  
✅ Easy to modify  

## Supported Keywords & Responses

| User Types | Bot Responds With |
|------------|-------------------|
| course, program, batch | Course details & pricing |
| fees, price, cost | Complete fee structure |
| ssb, screening, interview | SSB process guide |
| online, live, mentorship | Online program details |
| residential, offline | Residential program details |
| digital, practice, psychology | Digital platform info |
| contact, phone, email | Contact details |
| apply, enroll | Application process |

---

## 🚀 Quick Start (Local)

### Step 1: Install Node.js
Download from https://nodejs.org (LTS version)

### Step 2: Create Bot Folder
```bash
mkdir enlift-whatsapp-bot
cd enlift-whatsapp-bot
```

### Step 3: Copy Files
Copy these files to the folder:
- `wppconnect-bot.js`
- `whatsapp-bot-package.json`

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Run Bot
```bash
npm start
```

### Step 6: Scan QR Code
- A QR code will appear in terminal
- Open WhatsApp on your phone
- Go to Linked Devices
- Scan the QR code

✅ **Bot is live!** Messages will be auto-replied!

---

## 🌐 Deploy on Railway (Free 24/7)

### Option 1: Railway (Recommended)

1. **Create GitHub Repo**
   - Create new repo on GitHub
   - Upload `wppconnect-bot.js` and `package.json`
   
2. **Deploy on Railway**
   - Go to https://railway.app
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repo
   - Click "Deploy"

3. **Connect WhatsApp**
   - Go to Railway project → Deployments
   - Click on latest deployment → Logs
   - You'll see QR code in logs
   - Scan with WhatsApp (Linked Devices)
   
4. **Done!** Bot runs 24/7!

### Option 2: Render

1. Go to https://render.com
2. Create "Web Service"
3. Connect GitHub repo
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Deploy!

---

## 📝 Customize Responses

Edit `wppconnect-bot.js`:

```javascript
const responses = {
  course: `YOUR CUSTOM COURSE MESSAGE`,
  fees: `YOUR CUSTOM FEES MESSAGE`,
  // ... etc
};
```

---

## ⚠️ Important Notes

1. **Phone must stay online** - The bot works through your WhatsApp account. Your phone needs internet connection.

2. **One device at a time** - When bot is running, WhatsApp Web will be occupied.

3. **Restart if disconnected** - If bot stops, run `npm start` again.

4. **Rate limits** - Don't send too many messages too quickly to avoid temporary blocks.

---

## Cost Comparison

| Method | Monthly Cost |
|--------|-------------|
| WPPConnect (self-hosted) | FREE |
| Twilio WhatsApp API | ~₹1,500/month |
| Meta Business API | ~₹1,000/month |
| 24API.in | FREE* (limited) |

*WPPConnect is the best free option!*

---

## Troubleshooting

**Bot not responding?**
```bash
# Restart the bot
npm start
```

**Session expired?**
- Delete `tokens` folder if created
- Run `npm start` again
- Scan QR code again

**Need help?**
- Check logs for errors
- Restart the bot
- Re-scan QR code
