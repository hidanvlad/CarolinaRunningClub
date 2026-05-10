// src/pages/LandingPage/ImpactCounter.jsx
import React from 'react';

const ImpactCounter = () => {
    const stats = [
        { label: "Evenimente organizate", value: "25+" },
        { label: "Alergătorii pe Strava", value: "90" },
        { label: "Cafele băute", value: "150+" },
        { label: "Kilometri parcurși", value: "120km+" }
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