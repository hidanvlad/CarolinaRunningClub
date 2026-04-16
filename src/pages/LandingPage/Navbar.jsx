import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav style={styles.navbarFixed}>
            <div style={styles.navContainer}>
                {/* Logo takes you back to Landing Page */}
                <div style={styles.logo} onClick={() => navigate('/')}>
                    Carolina Running Club
                </div>

                <div style={styles.navActions}>
                    {/* Join Us takes you to Register */}
                    <span
                        style={styles.joinLink}
                        onClick={() => navigate('/register')}
                    >
                        Join Us
                    </span>

                    {/* Login takes you to Login Page */}
                    <button
                        style={styles.loginButton}
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </div>
            </div>
        </nav>
    );
};

const styles = {
    navbarFixed: {
        backgroundColor: '#1E1E1E',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxSizing: 'border-box',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        opacity: 0.99
    },
    navContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '10px 40px',
        width: '100%',
        boxSizing: 'border-box'
    },
    logo: { color: '#FFFFFF', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
    navActions: { display: 'flex', alignItems: 'center', gap: '30px' },
    joinLink: {
        color: '#8B0000',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '14px',
        cursor: 'pointer'
    },
    loginButton: {
        backgroundColor: '#8B0000',
        color: '#FFFFFF',
        border: 'none',
        padding: '8px 25px',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer'
    }
};

export default Navbar;