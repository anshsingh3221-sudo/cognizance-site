# Cognizance Event Registration Site

A practice event-registration website for a college tech fest, built as part of my application for the web development article at Cognizance, IIT Roorkee. It is not the official fest website.

**Live site:** [paste your Vercel link here]

## Features

- Home page with a live countdown, event categories and a 3-day schedule
- Sign in with Google, email OTP, or phone OTP
- Personal dashboard showing your name, photo and verification status
- Register for or cancel events, saved per user in a database
- Fully responsive layout (works on phones)

## Tech stack

- **Next.js** (React) for the frontend
- **Supabase** for authentication and the Postgres database
- **Vercel** for hosting

## Run it locally

1. Clone the repo and run `npm install`
2. Copy `.env.local.example` to `.env.local` and add your own Supabase URL and anon key
3. Run `npm run dev` and open http://localhost:3000

## Notes

- Phone login uses Supabase test phone numbers for demonstration. Sending real SMS needs an SMS provider such as Twilio.
- Database access is protected with Supabase row-level security, so users only see their own registrations.

## What I learned

I learned from this project that how to align supabase parallel to google login or phone login, how to launch my web for all devices using vercel.