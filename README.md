# Cognizance practice site (Next.js + Supabase)

Landing page, email OTP sign-in, Google sign-in, and an event registration dashboard.

## 1. Run it locally

```bash
npm install
cp .env.local.example .env.local      # then fill in the two values (step 2)
npm run dev                           # http://localhost:3000
```

## 2. Create the Supabase project (free)

1. Go to supabase.com, create a project.
2. Project Settings > API: copy the **Project URL** and the **anon public key** into `.env.local`.
3. SQL Editor: paste and run `supabase/schema.sql`. This creates the registrations table with row-level security, so each user can only see and edit their own rows.

## 3. Turn on email OTP (6-digit code)

1. Authentication > Providers > Email: keep it enabled.
2. Authentication > Email Templates: edit **both** "Magic Link" and "Confirm signup" (new users get the second one). Replace the body with:

```html
<h2>Your Cognizance code</h2>
<p>Enter this 6-digit code to continue:</p>
<h1>{{ .Token }}</h1>
```

Without `{{ .Token }}` in the template, Supabase sends a link instead of a code.

## 4. Turn on Google sign-in

1. Google Cloud Console > APIs & Services > Credentials > Create credentials > OAuth client ID > Web application.
2. Authorized redirect URI: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
3. Copy the Client ID and Client Secret.
4. Supabase > Authentication > Providers > Google: enable it and paste both values.
5. Supabase > Authentication > URL Configuration:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: add `http://localhost:3000/dashboard`
   (Add your deployed URL here too, e.g. your Vercel link.)

## 5. Deploy

Push to GitHub, import the repo on Vercel, add the two environment variables, deploy, then add the Vercel URL to Supabase's URL Configuration.

## Notes

- Supabase's built-in email sender allows only a few emails per hour. For real use, add custom SMTP (Resend, Brevo) under Authentication > SMTP Settings.
- Google accounts are already email-verified. OTP users become verified when they enter the code. The dashboard shows this as a badge.
- Project layout: `app/` pages, `components/` shared UI, `lib/` Supabase client and event data, `supabase/` SQL.
