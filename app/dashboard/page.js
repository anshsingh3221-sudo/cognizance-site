'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '../../components/Nav';
import { supabase } from '../../lib/supabase';
import { EVENTS } from '../../lib/events';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mine, setMine] = useState([]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState('');

  async function load() {
    const { data } = await supabase.from('registrations').select('event');
    setMine((data ?? []).map((r) => r.event));
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return router.replace('/login');
      setUser(data.session.user); load();
    });
  }, [router]);

  async function toggle(title) {
    if (busy) return;
    setNote('');
    setBusy(title);
    const { error } = mine.includes(title)
      ? await supabase.from('registrations').delete().eq('event', title)
      : await supabase.from('registrations').insert({ event: title });
    setBusy('');
    if (error) return setNote(error.message);
    load();
  }

  async function signOut() { await supabase.auth.signOut(); router.replace('/'); }

  if (!user) return <main className="authpage"><p className="msg">Loading...</p></main>;

  const meta = user.user_metadata ?? {};
  const name = meta.full_name ?? user.email?.split('@')[0] ?? 'Welcome';
  const photo = meta.avatar_url ?? meta.picture;
  const contact = user.email ?? (user.phone ? `+${user.phone.replace(/^\+/, '')}` : '');
  const verified = !!(user.email_confirmed_at || user.phone_confirmed_at);

  return (
    <>
      <Nav />
      <main className="wrap dash">
        <div className="dashhead">
          <div className="who">
            {photo
              ? <img className="avatar" src={photo} alt="" referrerPolicy="no-referrer" />
              : <div className="avatar initial" aria-hidden="true">{name[0].toUpperCase()}</div>}
            <div>
              <h1>{name}</h1>
              <p className="lead">{contact} <span className={verified ? 'badge ok' : 'badge'}>{verified ? 'Verified' : 'Not verified'}</span></p>
            </div>
          </div>
          <button className="btn ghost" onClick={signOut}>Sign out</button>
        </div>
        <h2>Your events</h2>
        <p className="lead">{mine.length ? `You are registered for ${mine.length} event${mine.length > 1 ? 's' : ''}.` : 'You have not registered for anything yet. Pick an event below.'}</p>
        <div className="events">
          {EVENTS.map((e) => {
            const on = mine.includes(e.title);
            return (
              <article className="card" key={e.title}>
                <div className="icon" aria-hidden="true">{e.icon}</div>
                <h3>{e.title}</h3>
                <p>{e.text}</p>
                <button
                  className={on ? 'btn ghost small' : 'btn small'}
                  onClick={() => toggle(e.title)}
                  disabled={!!busy}
                >
                  {busy === e.title ? 'Saving...' : on ? 'Cancel registration' : 'Register'}
                </button>
              </article>
            );
          })}
        </div>
        <p className="msg err">{note}</p>
      </main>
    </>
  );
}