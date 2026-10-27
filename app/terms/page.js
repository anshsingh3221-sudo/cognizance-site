import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export const metadata = { title: 'Terms of Use' };

export default function Terms() {
  return (
    <>
      <Nav />
      <main className="wrap legal">
        <h1>Terms of Use</h1>
        <p className="lead">Last updated: October 2026</p>

        <h2>About this site</h2>
        <p>This is an independent practice project. It is not the official Cognizance website, and registering here does not guarantee entry to any event.</p>

        <h2>Your account</h2>
        <p>Give accurate details and keep your login secure. You are responsible for activity on your account.</p>

        <h2>Acceptable use</h2>
        <p>Do not try to break, overload or gain unauthorised access to the site or other people's data.</p>

        <h2>Availability</h2>
        <p>The site is provided as is, and may change or go offline without notice.</p>

        <h2>Changes</h2>
        <p>We may update these terms. Continuing to use the site means you accept the updated version.</p>
      </main>
      <Footer />
    </>
  );
}