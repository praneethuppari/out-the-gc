# Free Hosting Guide for Wasp Application

This guide covers free hosting options for your Wasp application. Your app needs:
- Full-stack hosting (React frontend + Node.js backend)
- PostgreSQL database
- Email service (for auth)

## 🚀 Recommended: Railway (Best Free Option)

**Railway** offers the best free tier for Wasp applications with $5/month free credit.

### Setup Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Database First**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Copy the connection string (DATABASE_URL)

3. **Deploy Your App**
   - In Railway, click "New" → "Deploy from GitHub repo"
   - Connect your GitHub repository
   - Railway will auto-detect Wasp projects

4. **Configure Environment Variables**
   Add these in Railway's environment variables:
   ```
   DATABASE_URL=<from PostgreSQL service>
   WASP_ENV=production
   ```

5. **Build & Deploy**
   Railway will automatically:
   - Run `wasp build`
   - Deploy your application
   - Provide a public URL

**Free Tier Limits:**
- $5/month credit (usually enough for small apps)
- 500 hours of usage
- Auto-sleeps after inactivity (wakes on request)

---

## 🎯 Alternative: Render

**Render** also offers a free tier with some limitations.

### Setup Steps:

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy PostgreSQL Database**
   - New → PostgreSQL
   - Choose "Free" plan
   - Copy the Internal Database URL

3. **Deploy Web Service**
   - New → Web Service
   - Connect your GitHub repo
   - Build Command: `wasp build`
   - Start Command: `wasp start`
   - Add environment variable: `DATABASE_URL=<your-db-url>`

**Free Tier Limits:**
- 750 hours/month
- Spins down after 15 min inactivity (takes ~30s to wake)
- Limited CPU/RAM

---

## 🗄️ Free Database Options

### Option 1: Neon (Recommended)
- **URL**: [neon.tech](https://neon.tech)
- **Free Tier**: 0.5GB storage, unlimited projects
- **Best for**: Production-ready PostgreSQL
- **Setup**: Create project → Copy connection string

### Option 2: Supabase
- **URL**: [supabase.com](https://supabase.com)
- **Free Tier**: 500MB database, 2GB bandwidth
- **Bonus**: Includes auth, storage, and real-time features

### Option 3: Railway PostgreSQL
- Included with Railway deployment
- Managed PostgreSQL instance

---

## 📧 Email Service (Free Options)

Your app currently uses `Dummy` email provider. For production, you need a real email service:

### Option 1: Resend (Recommended)
- **URL**: [resend.com](https://resend.com)
- **Free Tier**: 3,000 emails/month, 100 emails/day
- **Setup**:
  1. Sign up and verify domain
  2. Get API key
  3. Update `main.wasp`:
     ```wasp
     emailSender: {
       provider: Resend,
       defaultFrom: {
         name: "OutTheGC",
         email: "hello@yourdomain.com"
       },
       resendAPIKey: env.RESEND_API_KEY
     }
     ```

### Option 2: SendGrid
- **URL**: [sendgrid.com](https://sendgrid.com)
- **Free Tier**: 100 emails/day
- Similar setup to Resend

### Option 3: Mailgun
- **URL**: [mailgun.com](https://mailgun.com)
- **Free Tier**: 5,000 emails/month for 3 months, then 1,000/month

---

## 📝 Deployment Checklist

Before deploying:

- [ ] Update `emailSender` in `main.wasp` (remove Dummy provider)
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Test email sending locally
- [ ] Update CORS settings if needed
- [ ] Set up custom domain (optional)

---

## 🔧 Quick Railway Deployment

**Fastest path to production:**

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Railway Setup** (5 minutes):
   - Go to railway.app
   - New Project → Deploy from GitHub
   - Select your repo
   - Add PostgreSQL service
   - Railway auto-detects Wasp and deploys!

3. **Get your URL**
   - Railway provides: `your-app.railway.app`
   - Share this link with users!

---

## 💡 Tips for Free Hosting

1. **Monitor Usage**: Check Railway/Render dashboards regularly
2. **Optimize Images**: Use CDN (Cloudinary free tier) for images
3. **Database Cleanup**: Regularly clean old data to stay within limits
4. **Caching**: Implement caching to reduce database queries
5. **Error Monitoring**: Use Sentry (free tier) for error tracking

---

## 🆘 Troubleshooting

**App won't start:**
- Check environment variables are set
- Verify DATABASE_URL is correct
- Check build logs in Railway/Render dashboard

**Database connection errors:**
- Ensure DATABASE_URL includes SSL parameters
- For Neon: Add `?sslmode=require` to connection string

**Email not sending:**
- Verify email provider API key
- Check email provider dashboard for errors
- Ensure "from" email is verified

---

## 📚 Additional Resources

- [Wasp Deployment Docs](https://wasp.sh/docs/deployment)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Neon Docs](https://neon.tech/docs)

---

**Recommended Stack for Free Hosting:**
- **Hosting**: Railway
- **Database**: Neon PostgreSQL
- **Email**: Resend
- **Total Cost**: $0/month (within free tier limits)

