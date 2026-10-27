import './globals.css';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--f-display' });
const body = Manrope({ subsets: ['latin'], variable: '--f-body' });

export const metadata = {
  title: 'Cognizance: practice fest site',
  description: 'A student-built tech fest website with email OTP and Google sign-in.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
