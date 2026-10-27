import './globals.css';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--f-display' });
const body = Manrope({ subsets: ['latin'], variable: '--f-body' });

export const metadata = {
  metadataBase: new URL('https://cognizance-site.vercel.app'),
  title: {
    default: 'Cognizance Registration',
    template: '%s | Cognizance',
  },
  description: 'Sign in with Google, email or phone, then register for events from one dashboard. A practice build for Cognizance, IIT Roorkee.',
  openGraph: {
    title: 'Cognizance Registration',
    description: 'Sign in and register for events from one dashboard.',
    type: 'website',
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
