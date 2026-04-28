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
            <Hero />

            {/* CTA Section */}
            <div style={styles.buttonSection}>
                <button
                    style={styles.ctaButton}
                    onClick={() => navigate('/login')}
                >
                    Start Your Journey
                </button>
            </div>

            {/* Content Sections */}
            <InfoCards />

            {/* Optional: Add a Gallery or Events section here later */}

            <Footer />
        </div>
    );
};

const styles = {
    landingPageContainer: {
        backgroundColor: '#121212', // Match the club vibe
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column'
    },
    buttonSection: {
        display: 'flex',
        justifyContent: 'center',
        padding: '80px 0',
        backgroundColor: '#FFFFFF' // Contrast break
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