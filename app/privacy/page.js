import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export const metadata = { title: 'Privacy Policy' };

export default function Privacy() {
  return (
    <>
      <Nav />
      <main className="wrap legal">
        <h1>Privacy Policy</h1>
        <p className="lead">Last updated: October 2026</p>

        <h2>What we collect</h2>
        <p>When you sign in we receive your email address or phone number, and your name and profile photo if you use Google. If you fill in your details we also store your full name, college and year of study. We store which events you register for.</p>

        <h2>How we use it</h2>
        <p>We use this information only to run your account and event registrations, and to let the organisers see who has registered. We do not sell your data or use it for advertising.</p>

        <h2>Where it is stored</h2>
        <p>Data is stored with Supabase, and the site is hosted on Vercel. We use Vercel Analytics to count visits. It does not use advertising cookies.</p>

        <h2>Who can see it</h2>
        <p>You can see and edit your own details. Site administrators can view registration data to manage the event.</p>

        <h2>Your choices</h2>
        <p>You can edit your details or cancel registrations from your dashboard at any time. To have your account and data deleted, email us at the address in the footer.</p>

        <h2>Contact</h2>
        <p>Questions about this policy can be sent to the contact email in the footer.</p>
      </main>
      <Footer />
    </>
  );
}