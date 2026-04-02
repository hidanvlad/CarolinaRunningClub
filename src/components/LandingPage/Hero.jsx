// src/components/LandingPage/Hero.jsx
import React from 'react';

const Hero = () => {
    return (
        <section style={styles.heroSection}>
            {/* Containerul central semi-transparent */}
            <div style={styles.glassCard}>
                <h1 style={styles.mainTitle}>Carolina Running Club</h1>
                <h2 style={styles.subTitle}>Community & Movement</h2>
                <p style={styles.description}>
                    Descoperă comunitatea noastră de alergători, urmărește progresul lunar
                    și participă la evenimentele noastre săptămânale. Un loc unde mișcarea
                    întâlnește prietenia, indiferent de ritmul tău.
                </p>
            </div>
        </section>
    );
};

const styles = {
    heroSection: {
        height: '80vh',
        backgroundImage: 'url("/crc-event-13.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '60px', // Spatiu pentru Navbar-ul fix, sa nu suprapuna textul
        width: '100%',
        boxSizing: 'border-box'
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Efect de transparenta
        backdropFilter: 'blur(5px)', // Blur pe fundal pentru modernism
        padding: '50px',
        borderRadius: '20px',
        textAlign: 'center',
        maxWidth: '750px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        margin: '0 20px' // Padding lateral pe ecrane mici
    },
    mainTitle: { color: '#FFFFFF', fontSize: '52px', margin: '0', fontWeight: 'bold' },
    subTitle: { color: '#8B0000', fontSize: '24px', margin: '15px 0' },
    description: {
        color: '#FFFFFF',
        fontSize: '17px',
        lineHeight: '1.7',
        opacity: '0.9',
        maxWidth: '600px',
        margin: '0 auto'
    }
};

export default Hero;