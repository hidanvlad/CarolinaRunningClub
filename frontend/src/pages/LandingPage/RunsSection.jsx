// src/components/LandingPage/RunsSection.jsx (Features)
import React from 'react';

const RunsSection = () => {
    return (
        <section style={styles.whiteSection}>
            {/* Butonul CTA centrat */}
            <div style={styles.ctaContainer}>
                <button style={styles.ctaButton}>Start Your Journey</button>
            </div>

            <div style={styles.cardsGrid}>
                <div style={styles.card}>
                    <div style={{ color: '#8B0000' }}>📅</div>
                    <h3>Events</h3>
                    <p>Vezi calendarul de alergări și locațiile noastre.</p>
                </div>
                <div style={styles.card}>
                    <div style={{ color: '#8B0000' }}>👥</div>
                    <h3>Community</h3>
                    <p>Poze și clipuri de la ultimele evenimente realizate.</p>
                </div>
                <div style={styles.card}>
                    <div style={{ color: '#8B0000' }}>🛍️</div>
                    <h3>Shop Merch</h3>
                    <p>Poartă culorile clubului: tricouri și accesorii oficiale.</p>
                </div>
            </div>
        </section>
    );
};

const styles = {
    whiteSection: { backgroundColor: '#FFFFFF', padding: '60px 0', textAlign: 'center' },
    ctaContainer: { marginBottom: '50px' },
    ctaButton: {
        backgroundColor: '#8B0000',
        color: '#FFFFFF',
        border: 'none',
        padding: '12px 40px',
        borderRadius: '25px',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer'
    },
    cardsGrid: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        padding: '0 40px'
    },
    card: {
        backgroundColor: '#EAEAEA', 
        padding: '30px',
        borderRadius: '15px',
        flex: 1,
        maxWidth: '300px'
    }
};

export default RunsSection;