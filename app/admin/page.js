'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '../../components/Nav';
import { supabase } from '../../lib/supabase';
import { EVENTS } from '../../lib/events';

export default function Admin() {
  const router = useRouter();
  const [state, setState] = useState('checking');
  const [people, setPeople] = useState([]);
  const [regs, setRegs] = useState([]);
  const [q, setQ] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [err, setErr] = useState('');

  async function load() {
    setErr('');
    const [p, r] = await Promise.all([
      supabase.rpc('admin_overview'),
      supabase.from('registrations').select('*'),
    ]);
    if (p.error || r.error) return setErr((p.error || r.error).message);
    setPeople(p.data ?? []);
    setRegs(r.data ?? []);
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return router.replace('/login');
      const { data: ok } = await supabase.rpc('is_admin');
      if (!ok) return setState('denied');
      setState('ready');
      load();
    });
  }, [router]);

  const byUser = useMemo(() => {
    const m = {};
    regs.forEach((r) => { (m[r.user_id] = m[r.user_id] || []).push(r.event); });
    return m;
  }, [regs]);

  const counts = useMemo(
    () => EVENTS.map((e) => ({ title: e.title, count: regs.filter((r) => r.event === e.title).length })),
    [regs]
  );

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return people
      .map((p) => ({ ...p, events: byUser[p.id] ?? [] }))
      .filter((p) => !eventFilter || p.events.includes(eventFilter))
      .filter((p) =>
        !term ||
        [p.full_name, p.email, p.phone, p.college].some((v) => (v ?? '').toLowerCase().includes(term))
      );
  }, [people, byUser, q, eventFilter]);

  function exportCsv() {
    const head = ['Name', 'Email', 'Phone', 'College', 'Year', 'Events', 'Joined'];
    const safe = (v) => {
      let s = String(v ?? '');
      if (/^[=+\-@]/.test(s)) s = "'" + s;
      return '"' + s.replace(/"/g, '""') + '"';
    };
    const lines = rows.map((p) =>
      [p.full_name, p.email, p.phone, p.college, p.year, p.events.join('; '),
        new Date(p.created_at).toLocaleDateString()].map(safe).join(',')
    );
    const blob = new Blob([[head.map(safe).join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'cognizance-participants.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (state === 'checking') return <main className="authpage"><p className="msg">Loading...</p></main>;

  if (state === 'denied') {
    return (
      <>
        <Nav />
        <main className="wrap notfound">
          <p className="nfcode">404</p>
          <h1>Page not found</h1>
        </main>
      </>
    );
  }

  const profilesDone = people.filter((p) => p.full_name).length;

  return (
    <>
      <Nav />
      <main className="wrap dash">
        <div className="dashhead">
          <div>
            <h1>Admin</h1>
            <p className="lead">Overview of everyone registered on the site.</p>
          </div>
          <button className="btn ghost small" onClick={load}>Refresh</button>
        </div>

        <div className="adminstats">
          <div className="stat"><span>{people.length}</span>Users</div>
          <div className="stat"><span>{regs.length}</span>Registrations</div>
          <div className="stat"><span>{profilesDone}</span>Profiles completed</div>
        </div>

        <h2>Registrations per event</h2>
        <div className="eventcounts">
          {counts.map((c) => (
            <div className="ecount" key={c.title}>
              <strong>{c.count}</strong>
              <span>{c.title}</span>
            </div>
          ))}
        </div>

        <h2>Participants</h2>
        <div className="toolbar">
          <input placeholder="Search name, email, phone, college" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
            <option value="">All events</option>
            {EVENTS.map((e) => <option key={e.title}>{e.title}</option>)}
          </select>
          <button className="btn small" onClick={exportCsv}>Export CSV ({rows.length})</button>
        </div>
        <p className="msg err">{err}</p>

        <div className="tablewrap">
          <table className="atable">
            <thead>
              <tr><th>Name</th><th>Contact</th><th>College</th><th>Year</th><th>Events</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.full_name || <em>Not added</em>}</td>
                  <td>{p.email || (p.phone ? `+${p.phone}` : '')}</td>
                  <td>{p.college || ''}</td>
                  <td>{p.year || ''}</td>
                  <td>{p.events.length ? p.events.map((e) => <span className="chip" key={e}>{e}</span>) : <em>None</em>}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan="6"><em>No matching users.</em></td></tr>}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}