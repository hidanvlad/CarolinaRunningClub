import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Hero from './Hero';
import InfoCards from './InfoCards';
import Footer from './Footer';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.landingPageContainer}>
            <Navbar />
            <div style={styles.contentWrapper}>
                <Hero />

                {/* THIS IS THE ONLY BUTTON NOW */}
                <div style={styles.buttonSection}>
                    <button
                        style={styles.ctaButton}
                        onClick={() => navigate('/login')}
                    >
                        Start Your Journey
                    </button>
                </div>

                <InfoCards />
                <Footer />
            </div>
        </div>
    );
};

const styles = {
    landingPageContainer: { backgroundColor: '#FFFFFF', minHeight: '100vh', width: '100%' },
    contentWrapper: { width: '100%', display: 'flex', flexDirection: 'column' },
    buttonSection: {
        display: 'flex',
        justifyContent: 'center',
        padding: '50px 0',
        backgroundColor: '#FFFFFF'
    },
    ctaButton: {
        backgroundColor: '#8B0000',
        color: '#FFFFFF',
        border: 'none',
        padding: '16px 45px',
        borderRadius: '50px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.2s ease'
    }
};

export default LandingPage;