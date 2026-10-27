import Link from 'next/link';
import Nav from '../components/Nav';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="wrap notfound">
        <p className="nfcode">404</p>
        <h1>This page drifted out of orbit</h1>
        <p className="lead">The link may be broken, or the page may have moved.</p>
        <Link className="btn" href="/">Back to home</Link>
      </main>
    </>
  );
}
