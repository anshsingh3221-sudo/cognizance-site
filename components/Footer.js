import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <span>© {new Date().getFullYear()} Cognizance practice site. Not the official website.</span>
        <span className="footlinks">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="mailto:anshsingh3221@gmail.com">Contact</a>
        </span>
      </div>
    </footer>
  );
}