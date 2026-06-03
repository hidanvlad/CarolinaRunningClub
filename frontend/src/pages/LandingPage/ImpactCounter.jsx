// src/pages/LandingPage/ImpactCounter.jsx
import React, { useState, useEffect } from 'react';

const ImpactCounter = () => {
    // 1. Establish data states holding accurate baseline fallback counters
    const [liveStats, setLiveStats] = useState({
        events: "25+",
        runners: "90",
        coffees: "150+",
        kilometers: "120km+"
    });

    // 2. Fetch the public, unauthenticated metrics summary on rendering mount loops
    useEffect(() => {
        fetch('https://carolina-running-club-backend.onrender.com/api/RunActivities/public-summary')
            .then(res => {
                if (!res.ok) throw new Error("Network summary response failure.");
                return res.json();
            })
            .then(data => {
                setLiveStats({
                    events: `${data.totalEvents}+`,
                    runners: String(data.totalRunners),
                    coffees: "150+", // Fun static metric left intact
                    kilometers: `${data.totalKm} km`
                });
            })
            .catch(err => console.warn("[LANDING STATS] Server offline or loading. Using fallbacks:", err));
    }, []);

    // 3. Map values safely down to display container grid items
    const stats = [
        { label: "Evenimente organizate", value: liveStats.events },
        { label: "Alergătorii pe Strava", value: liveStats.runners },
        { label: "Cafele băute", value: liveStats.coffees },
        { label: "Kilometri parcurși", value: liveStats.kilometers }
    ];

    return (
        <section style={styles.section}>
            <div style={styles.container}>
                {stats.map((stat, i) => (
                    <div key={i} style={styles.statBox}>
                        <h2 style={styles.value}>{stat.value}</h2>
                        <p style={styles.label}>{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

const styles = {
    section: { backgroundColor: '#000', padding: '50px 20px', textAlign: 'center' },
    container: { display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' },
    statBox: { padding: '20px', minWidth: '200px' },
    value: { color: '#8B0000', fontSize: '48px', fontWeight: 'bold', margin: '0 0 10px 0' },
    label: { color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }
};

export default ImpactCounter;