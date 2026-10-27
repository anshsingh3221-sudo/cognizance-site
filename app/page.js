'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Sky from '../components/Sky';
import Footer from '../components/Footer';
import { EVENTS, FEST_DATE } from '../lib/events';

const pad = (n) => String(n).padStart(2, '0');

function useCountdown(date) {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const tick = () => {
      let d = Math.max(0, new Date(date).getTime() - Date.now());
      const days = Math.floor(d / 864e5); d %= 864e5;
      const h = Math.floor(d / 36e5); d %= 36e5;
      setLeft({ days, h, m: Math.floor(d / 6e4), s: Math.floor((d % 6e4) / 1e3) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [date]);
  return left;
}

export default function Home() {
  const t = useCountdown(FEST_DATE);
  const units = [
    [t ? pad(t.days) : '--', 'days'],
    [t ? pad(t.h) : '--', 'hours'],
    [t ? pad(t.m) : '--', 'minutes'],
    [t ? pad(t.s) : '--', 'seconds'],
  ];

  return (
    <>
      <Nav />
      <header className="hero">
        <Sky />
        <div className="ring r1" /><div className="ring r2" />
        <div className="wrap heroin">
          <p className="when">13 to 15 March 2027, IIT Roorkee</p>
          <h1>Where ideas<br />leave orbit</h1>
          <p className="sub">Three days of competitions, workshops and talks, run by students for anyone who likes building things.</p>
          <div className="count">
            {units.map(([v, l]) => <div key={l}><b>{v}</b><small>{l}</small></div>)}
          </div>
          <div className="cta">
            <Link className="btn" href="/login">Register or sign in</Link>
            <a className="btn ghost" href="#events">Browse events</a>
          </div>
        </div>
      </header>

      <section id="about">
        <div className="wrap about">
          <div>
            <h2>One place to join the fest</h2>
            <p className="lead">Sign in, pick the events you want, and manage every registration from a single dashboard. Cancel or change your mind anytime.</p>
          </div>
          <div className="stats">
            <div><b>3</b><span>Days on campus</span></div>
            <div><b>{EVENTS.length}</b><span>Event categories</span></div>
            <div><b>1 min</b><span>To register</span></div>
            <div><b>IITR</b><span>Roorkee campus</span></div>
          </div>
        </div>
      </section>

      <section id="events">
        <div className="wrap">
          <h2>Pick your arena</h2>
          <p className="lead">Sign in once, then register for as many events as you like from your dashboard.</p>
          <div className="events">
            {EVENTS.map((e) => (
              <article className="card" key={e.title}>
                <div className="icon" aria-hidden="true">{e.icon}</div>
                <h3>{e.title}</h3>
                <p>{e.text}</p>
                <p className="team">{e.team}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="schedule">
        <div className="wrap">
          <h2>Your three days</h2>
          <p className="lead">Times are placeholders until the final timetable is out.</p>
          <div className="timeline">
            {[
              ['Day 1: Friday', [['10:00', 'Opening ceremony'], ['12:00', 'Web development workshop'], ['16:00', 'Hackathon kickoff']]],
              ['Day 2: Saturday', [['09:30', 'Robotics arena rounds'], ['14:00', 'Guest lecture'], ['20:00', 'Astronomy night']]],
              ['Day 3: Sunday', [['11:00', 'Hackathon demos'], ['15:00', 'Finals and prizes'], ['18:00', 'Closing ceremony']]]
            ].map(([day, items]) => (
              <div className="day" key={day}>
                <h3>{day}</h3>
                <ul>{items.map(([tm, tx]) => <li key={tx}><b>{tm}</b>{tx}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap">
          <h2>Questions</h2>
          <p className="lead">Quick answers before you register.</p>
          <div className="faq">
            {[
              ['How do I register?', 'Click Register or sign in, log in with Google, email or phone, then choose events from your dashboard.'],
              ['Can I register for more than one event?', 'Yes. Register for as many as you like, and cancel any of them from the dashboard.'],
              ['Does it cost anything?', 'This is a practice build, so nothing is charged. Fees for the real fest will be announced separately.'],
              ['I did not get my OTP. What now?', 'Wait a minute, check spam if you used email, then try again. You can also use Google sign-in instead.'],
              ['Can I change my details later?', 'Yes. Use the Edit button in the Your details section on your dashboard.'],
              ['Is this the official Cognizance site?', 'No. It is an independent practice project and not affiliated with the official fest.'],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="join">
        <div className="wrap finalcta">
          <h2>Ready to take off?</h2>
          <p className="lead">Create your account and lock in your events.</p>
          <Link className="btn" href="/login">Get started</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}