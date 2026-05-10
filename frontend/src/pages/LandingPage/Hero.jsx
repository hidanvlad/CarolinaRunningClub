/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section style={styles.heroSection}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    ...styles.glassCard,
                    padding: isMobile ? '40px 20px' : '60px 40px',
                    width: isMobile ? '95%' : '90%'
                }}
            >
                <h1 style={styles.mainTitle}>CAROLINA RUNNING CLUB</h1>
                <h2 style={styles.subTitle}>Community • Movement • Progress</h2>
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
        height: '100vh',
        width: '100vw',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url("/crc-event-13.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    glassCard: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        borderRadius: '30px',
        textAlign: 'center',
        maxWidth: '900px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    },
    mainTitle: {
        color: '#FFFFFF',
        fontSize: 'clamp(28px, 8vw, 64px)',
        margin: '0',
        fontWeight: '900',
        letterSpacing: '1px'
    },
    subTitle: {
        color: '#8B0000',
        fontSize: 'clamp(16px, 3vw, 28px)',
        margin: '15px 0',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    description: {
        color: '#E0E0E0',
        fontSize: 'clamp(13px, 2.5vw, 18px)',
        maxWidth: '700px',
        margin: '0 auto',
        lineHeight: '1.6'
    }
};

export default Hero;