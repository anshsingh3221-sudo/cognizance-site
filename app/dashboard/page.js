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
  const [profile, setProfile] = useState({ full_name: '', college: '', year: '' });
  const [hasProfile, setHasProfile] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pnote, setPnote] = useState({ text: '', error: false });

  async function loadEvents() {
    const { data } = await supabase.from('registrations').select('event');
    setMine((data ?? []).map((r) => r.event));
  }

  async function loadProfile(uid) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, college, year')
      .eq('id', uid)
      .maybeSingle();
    if (data) {
      setProfile({ full_name: data.full_name ?? '', college: data.college ?? '', year: data.year ?? '' });
      setHasProfile(true);
      setEditing(false);
    } else {
      setEditing(true);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return router.replace('/login');
      setUser(data.session.user);
      loadEvents();
      loadProfile(data.session.user.id);
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
    loadEvents();
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setPnote({ text: '', error: false });
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: profile.full_name.trim(),
      college: profile.college.trim(),
      year: profile.year,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) return setPnote({ text: error.message, error: true });
    setHasProfile(true);
    setEditing(false);
    setPnote({ text: 'Details saved.', error: false });
  }

  async function signOut() { await supabase.auth.signOut(); router.replace('/'); }

  if (!user) return <main className="authpage"><p className="msg">Loading...</p></main>;

  const meta = user.user_metadata ?? {};
  const phoneNum = user.phone ? `+${user.phone.replace(/^\+/, '')}` : '';
  const name = profile.full_name || meta.full_name || user.email?.split('@')[0] || 'Welcome';
  const photo = meta.avatar_url || meta.picture;
  const contact = user.email || phoneNum;
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

        <section className="profilecard">
          <div className="phead">
            <h2>Your details</h2>
            {!editing && <button className="btn ghost small" onClick={() => setEditing(true)}>Edit</button>}
          </div>
          {editing ? (
            <form onSubmit={saveProfile} className="pform">
              <label>Full name
                <input required maxLength={80} value={profile.full_name} autoComplete="name"
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} placeholder="Your full name" />
              </label>
              <label>College
                <input maxLength={120} value={profile.college}
                  onChange={(e) => setProfile({ ...profile, college: e.target.value })} placeholder="Your college or school" />
              </label>
              <label>Year
                <select value={profile.year} onChange={(e) => setProfile({ ...profile, year: e.target.value })}>
                  <option value="">Select year</option>
                  <option>1st year</option>
                  <option>2nd year</option>
                  <option>3rd year</option>
                  <option>4th year</option>
                  <option>5th year</option>
                  <option>Other</option>
                </select>
              </label>
              <div className="prow">
                <button className="btn small" disabled={saving}>{saving ? 'Saving...' : 'Save details'}</button>
                {hasProfile && (
                  <button type="button" className="btn ghost small" onClick={() => { setEditing(false); loadProfile(user.id); }}>Cancel</button>
                )}
              </div>
            </form>
          ) : (
            <p className="lead">{profile.college || 'College not added'}{profile.year ? ` · ${profile.year}` : ''}</p>
          )}
          <p className={pnote.error ? 'msg err' : 'msg'}>{pnote.text}</p>
        </section>

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