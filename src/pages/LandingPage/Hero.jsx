/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section style={styles.heroSection}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={styles.glassCard}
            >
                <h1 style={styles.mainTitle}>Carolina Running Club</h1>
                <h2 style={styles.subTitle}>Community & Movement</h2>
                <p style={styles.description}>
                    Descoperă comunitatea noastră de alergători, urmărește progresul lunar
                    și participă la evenimentele noastre săptămânale. Un loc unde mișcarea
                    întâlnește prietenia, indiferent de ritmul tău.
                </p>
            </motion.div>
        </section>
    );
};

const styles = {
    heroSection: {
        height: '60vh', // Fixed height to prevent it looking "too big"
        backgroundImage: 'url("/crc-event-13.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '60px',
        width: '100%',
        boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,0.2)'
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        padding: '40px 60px',
        borderRadius: '20px',
        textAlign: 'center',
        maxWidth: '800px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    mainTitle: { color: '#FFFFFF', fontSize: '52px', margin: '0', fontWeight: 'bold' },
    subTitle: { color: '#8B0000', fontSize: '24px', margin: '15px 0', fontWeight: 'bold' },
    description: { color: '#FFFFFF', fontSize: '18px', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }
};

export default Hero;