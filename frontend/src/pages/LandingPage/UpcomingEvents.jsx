// src/pages/LandingPage/UpcomingEvents.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UpcomingEvents = () => {
    const navigate = useNavigate();
    const eventData = [
        {
            title: "Morning Trail Run",
            date: "15 MAI",
            location: "Dealul Mamut",
            img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1000&auto=format&fit=crop"
        },
        {
            title: "Interval Training",
            date: "22 MAI",
            location: "Stadionul Municipal",
            img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop"
        },
        {
            title: "Evening City Run",  
            date: "29 MAI",
            location: "Obelisc Cetate",
            img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1000&auto=format&fit=crop"
        }
    ];

    return (
        <section style={styles.section}>
            <div style={styles.headerRow}>
                <h2 style={styles.title}>EVENIMENTE VIITOARE</h2>
                <button style={styles.viewAllBtn} onClick={() => navigate('/events')}>TOATE EVENIMENTELE →</button>
            </div>

            <div style={styles.eventGrid}>
                {eventData.map((ev, i) => (
                    <div key={i} style={{ ...styles.card, backgroundImage: `url(${ev.img})` }}>
                        <div style={styles.overlay}>
                            <div style={styles.dateTag}>{ev.date}</div>
                            <div style={styles.info}>
                                <h3 style={styles.evTitle}>{ev.title}</h3>
                                <p style={styles.evLoc}>{ev.location}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const styles = {
    section: { backgroundColor: '#121212', padding: '80px 40px', color: '#fff' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', maxWidth: '1200px', margin: '0 auto 40px auto' },
    title: { fontSize: '32px', fontWeight: 'bold', letterSpacing: '1px', borderLeft: '5px solid #8B0000', paddingLeft: '15px' },
    viewAllBtn: { background: 'none', border: '1px solid #444', borderRadius: '20px', color: '#fff', padding: '8px 20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
    eventGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' },
    card: {
        height: '400px',
        borderRadius: '15px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer'
    },
    overlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 10%, transparent 70%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px'
    },
    dateTag: {
        backgroundColor: '#8B0000',
        color: '#fff',
        padding: '5px 15px',
        borderRadius: '5px',
        width: 'fit-content',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    info: { marginBottom: '10px' },
    evTitle: { fontSize: '22px', margin: '0 0 5px 0', fontWeight: 'bold' },
    evLoc: { fontSize: '14px', color: '#ccc', margin: 0 }
};

export default UpcomingEvents;