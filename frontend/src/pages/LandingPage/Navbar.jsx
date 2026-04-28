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
        backgroundColor: 'rgba(18, 18, 18, 0.95)', // Slightly transparent
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2000,
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(5px)'
    },
    navContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '0 5%', // Responsive padding
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