'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Nav() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <nav className="nav">
      <div className="wrap navin">
        <Link href="/" className="logo">Cogni<span>zance</span></Link>
        <ul>
          <li><a href="/#events">Events</a></li>
          <li><a href="/#schedule">Schedule</a></li>
          <li><a href="/#about">About</a></li>
        </ul>
        {user
          ? <Link className="btn" href="/dashboard">My dashboard</Link>
          : <Link className="btn" href="/login">Sign in</Link>}
      </div>
    </nav>
  );
}
