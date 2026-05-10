// src/pages/LandingPage/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Hero from './Hero';
import ImpactCounter from './ImpactCounter';
import UpcomingEvents from './UpcomingEvents';
import MerchShop from './MerchShop';
import InfoCards from './InfoCards';
import Footer from './Footer';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.landingPageContainer}>
            <Navbar />
            <Hero />

            {/* NEW: Club Impact Section */}
            <ImpactCounter />

            {/* NEW: Events Section */}
            <UpcomingEvents />

            {/* NEW: Merch Section */}
            <MerchShop />

            {/* CTA Section - Contrast Break */}
            <div style={styles.buttonSection}>
                <div style={styles.ctaTextGroup}>
                    <h2 style={styles.ctaTitle}>Ready to hit the pavement?</h2>
                    
                </div>
                <button
                    style={styles.ctaButton}
                    onClick={() => navigate('/login')}
                >
                   Join our community
                </button>
            </div>

            {/* Content Sections */}
            <InfoCards />

            <Footer />
        </div>
    );
};

const styles = {
    landingPageContainer: {
        backgroundColor: '#121212',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden'
    },
    buttonSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px',
        backgroundColor: '#FFFFFF', // Clean contrast break
        textAlign: 'center'
    },
    ctaTextGroup: { marginBottom: '30px' },
    ctaTitle: { color: '#000', fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px 0' },
    ctaSub: { color: '#666', fontSize: '18px', margin: 0 },
    ctaButton: {
        backgroundColor: '#8B0000', // Dark Red to match the vibe
        color: '#FFFFFF',
        border: 'none',
        padding: '18px 60px',
        borderRadius: '50px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 10px 25px rgba(139, 0, 0, 0.3)',
        transition: 'all 0.3s ease'
    }
};

export default LandingPage;