import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import RunsSection from './RunsSection';
import Footer from './Footer';

const LandingPage = () => {
    return (
        <div style={styles.landingPageContainer}>
            <Navbar />
            <div style={styles.contentWrapper}>
                <Hero />
                <RunsSection />
                <Footer />
            </div>
        </div>
    );
};

const styles = {
    landingPageContainer: {
        backgroundColor: '#FFFFFF', // Set to white so the cards look right
        minHeight: '100vh',
        width: '100%',
    },
    contentWrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    }
};

export default LandingPage;