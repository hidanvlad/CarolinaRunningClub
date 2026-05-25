import React, { useMemo, useState } from 'react';
import { events, createGoogleCalendarLink, createIcsFile } from '../../data/eventsData';

const storageKey = 'crc-event-rsvps';

const loadRsvps = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
};

const EventsPage = () => {
  const [rsvpState, setRsvpState] = useState(loadRsvps);
  const today = new Date().toISOString().slice(0, 10);

  const upcomingEvents = useMemo(() => events.filter((e) => e.date >= today), [today]);
  const pastEvents = useMemo(() => events.filter((e) => e.date < today), [today]);

  const saveRsvp = (eventId, type) => {
    const next = { ...rsvpState, [eventId]: type };
    setRsvpState(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const getTaken = (eventId) => Object.values(rsvpState).filter((v, idx) => Number(Object.keys(rsvpState)[idx]) === eventId && v === 'rsvp').length;

  const downloadIcs = (event) => {
    const blob = new Blob([createIcsFile(event)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.toLowerCase().replace(/\s+/g, '-')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.title}>Weekly Runs & Events</h1>
        <p style={styles.subtitle}>Clear schedules and easy RSVP improve discoverability and club retention.</p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Upcoming Events</h2>
        <div style={styles.grid}>
          {upcomingEvents.map((event) => {
            const userState = rsvpState[event.id];
            const joined = getTaken(event.id);
            const full = joined >= event.capacity;

            return (
              <article key={event.id} style={styles.card}>
                <img src={event.image} alt={event.title} style={styles.image} />
                <div style={styles.content}>
                  <h3>{event.title}</h3>
                  <p>{event.date} • {event.time} • {event.city}</p>
                  <p><strong>Meeting point:</strong> {event.meetingPoint}</p>
                  <p><strong>Pace groups:</strong> {event.paceGroups.join(' | ')}</p>
                  <p><strong>Distance:</strong> {event.distanceKm} km • <strong>Capacity:</strong> {event.capacity} • <strong>Fee:</strong> {event.fee === 0 ? 'Free' : `€${event.fee}`}</p>

                  <div style={styles.actions}>
                    <button disabled={full} onClick={() => saveRsvp(event.id, 'rsvp')} style={styles.primaryBtn}>RSVP</button>
                    <button onClick={() => saveRsvp(event.id, 'waitlist')} style={styles.secondaryBtn}>Join waitlist</button>
                  </div>
                  <p style={styles.status}>Your status: <strong>{userState || 'none'}</strong></p>

                  <div style={styles.calendarRow}>
                    <button onClick={() => downloadIcs(event)} style={styles.linkBtn}>Add to Apple/Outlook (.ics)</button>
                    <a href={createGoogleCalendarLink(event)} target="_blank" rel="noreferrer" style={styles.linkBtn}>Add to Google Calendar</a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Past Events Archive & Photos</h2>
        {pastEvents.map((event) => (
          <article key={event.id} style={styles.archiveCard}>
            <h3>{event.title} — {event.date}</h3>
            <div style={styles.gallery}>
              {event.gallery.map((img, idx) => <img key={idx} src={img} alt={`${event.title} ${idx + 1}`} style={styles.galleryImage} />)}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

const styles = {
  page: { background: '#121212', color: '#f5f5f5', minHeight: '100vh', padding: '90px 24px 40px' },
  hero: { maxWidth: 1000, margin: '0 auto 28px' },
  title: { margin: 0, fontSize: 38, borderLeft: '5px solid #8B0000', paddingLeft: 14 },
  subtitle: { color: '#bdbdbd' },
  section: { maxWidth: 1000, margin: '0 auto 30px' },
  sectionTitle: { marginBottom: 14 },
  grid: { display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))' },
  card: { background: '#1d1d1d', borderRadius: 12, overflow: 'hidden', border: '1px solid #303030' },
  image: { width: '100%', height: 170, objectFit: 'cover' },
  content: { padding: 14, fontSize: 14 },
  actions: { display: 'flex', gap: 8, marginTop: 10 },
  primaryBtn: { background: '#8B0000', color: 'white', border: 'none', borderRadius: 20, padding: '8px 12px', cursor: 'pointer' },
  secondaryBtn: { background: 'transparent', color: '#fff', border: '1px solid #555', borderRadius: 20, padding: '8px 12px', cursor: 'pointer' },
  status: { color: '#d0d0d0' },
  calendarRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  linkBtn: { color: '#ffd7d7', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' },
  archiveCard: { background: '#191919', borderRadius: 10, padding: 14, border: '1px solid #292929', marginBottom: 12 },
  gallery: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10 },
  galleryImage: { width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }
};

export default EventsPage;
