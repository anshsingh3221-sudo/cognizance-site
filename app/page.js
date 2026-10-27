'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Sky from '../components/Sky';
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
  const units = t ? [[t.days, 'days'], [t.h, 'hours'], [t.m, 'minutes'], [t.s, 'seconds']] : [];

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
            {units.map(([v, l]) => <div key={l}><b>{pad(v)}</b><small>{l}</small></div>)}
          </div>
          <div className="cta">
            <Link className="btn" href="/login">Register with email or Google</Link>
            <a className="btn ghost" href="#events">Browse events</a>
          </div>
        </div>
      </header>

      <section id="about">
        <div className="wrap about">
          <div>
            <h2>A student-run fest that keeps growing</h2>
            <p className="lead">Started in 2003 as a hobbies club project, the fest now brings thousands of students together to compete, learn and ship. This is a practice build: replace the copy with your own.</p>
          </div>
          <div className="stats">
            <div><b>20+</b><span>Years running</span></div>
            <div><b>200+</b><span>Events and talks</span></div>
            <div><b>1000+</b><span>Colleges reached</span></div>
            <div><b>3</b><span>Days on campus</span></div>
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

      <footer>
        <div className="wrap foot">
          <span>Cognizance practice site. Not the official website.</span>
          <span>Next.js and Supabase</span>
        </div>
      </footer>
    </>
  );
}
