'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const router = useRouter();
  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  const [step, setStep] = useState('start'); // 'start' then 'code'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // 10 digits, +91 is added automatically
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState({ text: '', error: false });
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);

  const fullPhone = `+91${phone}`;
  const target = method === 'email' ? email : fullPhone;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) router.replace('/dashboard'); });
  }, [router]);

  useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  const say = (text, error = false) => setMsg({ text, error });

  function switchMethod(m) {
    setMethod(m); setStep('start'); setCode(''); say('');
  }

  async function sendCode(e) {
    e?.preventDefault();
    if (method === 'phone' && phone.length !== 10) return say('Enter a valid 10-digit mobile number.', true);
    setBusy(true); say('');
    const payload = method === 'email'
      ? { email, options: { shouldCreateUser: true } }
      : { phone: fullPhone, options: { shouldCreateUser: true } };
    const { error } = await supabase.auth.signInWithOtp(payload);
    setBusy(false);
    if (error) return say(error.message, true);
    setStep('code'); setWait(30);
    say(method === 'email'
      ? `We sent a 6-digit code to ${email}. It expires in one hour.`
      : `We sent a 6-digit code to ${fullPhone}. It expires in one minute.`);
  }

  async function verify(e) {
    e.preventDefault();
    setBusy(true); say('');
    const payload = method === 'email'
      ? { email, token: code.trim(), type: 'email' }
      : { phone: fullPhone, token: code.trim(), type: 'sms' };
    const { error } = await supabase.auth.verifyOtp(payload);
    setBusy(false);
    if (error) return say('That code is wrong or expired. Check it and try again.', true);
    router.push('/dashboard');
  }

  async function google() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
    if (error) say(error.message, true);
  }

  return (
    <main className="authpage">
      <div className="authcard">
        <Link href="/" className="logo">Cogni<span>zance</span></Link>
        <h1>{step === 'start' ? 'Sign in or create an account' : 'Enter your code'}</h1>

        {step === 'start' ? (
          <>
            <button className="gbtn" onClick={google} type="button">
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.5l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.2 5.5-4.7 7.2l7.5 5.8c4.4-4.1 7-10.1 7-17.5z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
              Continue with Google
            </button>
            <div className="or"><span>or use email or phone</span></div>

            <div className="tabs" role="tablist">
              <button type="button" role="tab" aria-selected={method === 'email'} className={method === 'email' ? 'tab on' : 'tab'} onClick={() => switchMethod('email')}>Email</button>
              <button type="button" role="tab" aria-selected={method === 'phone'} className={method === 'phone' ? 'tab on' : 'tab'} onClick={() => switchMethod('phone')}>Phone</button>
            </div>

            <form onSubmit={sendCode}>
              {method === 'email' ? (
                <label>Email address
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
                </label>
              ) : (
                <label>Mobile number
                  <div className="phonerow">
                    <span className="cc">+91</span>
                    <input type="tel" inputMode="numeric" required maxLength={10}
                      value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      autoComplete="tel-national" placeholder="9876543210" />
                  </div>
                </label>
              )}
              <button className="btn" disabled={busy}>{busy ? 'Sending...' : 'Send verification code'}</button>
            </form>
          </>
        ) : (
          <form onSubmit={verify}>
            <label>6-digit code
              <input className="otp" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required autoFocus
                value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" autoComplete="one-time-code" />
            </label>
            <button className="btn" disabled={busy || code.length !== 6}>{busy ? 'Verifying...' : 'Verify and continue'}</button>
            <div className="row">
              <button type="button" className="link" disabled={wait > 0 || busy} onClick={sendCode}>
                {wait > 0 ? `Resend code in ${wait}s` : 'Resend code'}
              </button>
              <button type="button" className="link" onClick={() => { setStep('start'); setCode(''); say(''); }}>
                {method === 'email' ? 'Change email' : 'Change number'}
              </button>
            </div>
          </form>
        )}
        <p className={msg.error ? 'msg err' : 'msg'} role="status">{msg.text}</p>
      </div>
    </main>
  );
}