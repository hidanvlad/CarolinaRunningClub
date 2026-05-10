import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav style={navStyles.navbarFixed}>
            <style>
                {`
                @keyframes drawFortress {
                    0% {
                        stroke-dashoffset: 450;
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        stroke-dashoffset: 0;
                        opacity: 0.3;
                    }
                }
                `}
            </style>
            <div style={navStyles.navContainer}>
                {/* Logo takes you back to Landing Page */}
                <div style={navStyles.logo} onClick={() => navigate('/')}>
                    Carolina Running Club
                </div>

                <div style={navStyles.animationSpace}>
                    <svg
                        width="125"  /* Adjusted to fit the 70px height */
                        height="125" /* Adjusted to fit the 70px height */
                        viewBox="0 0 100 100"
                        style={{ overflow: 'visible' }}
                    >
                        <path
                            /* YOUR EXACT HAND-MADE COORDINATES */
                            d="M 51 ,34 
                               L 57 ,41 
                               L 65 ,42 
                               L 62 ,50 
                               L 65 ,57 
                               L 57 ,59 
                               L 52 ,65 
                               L 46 ,63 
                               L 38 ,65 
                               L 36 ,57 
                               L 29 ,53 
                               L 35 ,47 
                               L 35 ,39 
                               L 44 ,39 
                               L 51 ,34     
                               Z"
                            fill="none"
                            stroke="#8B0000"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="450"
                            style={{
                                animation: 'drawFortress 6s linear infinite',
                                filter: 'drop-shadow(0 0 6px rgba(139, 0, 0, 0.6))'
                            }}
                        />
                    </svg>
                </div>

                <div style={navStyles.navActions}>
                    <span
                        style={navStyles.joinLink}
                        onClick={() => navigate('/register')}
                    >
                        Join Us
                    </span>
                    <button
                        style={navStyles.loginButton}
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </div>
            </div>
        </nav>
    );
};

const navStyles = {
    navbarFixed: {
        backgroundColor: 'rgba(18, 18, 18, 0.95)',
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
        padding: '0 5%'
    },
    animationSpace: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none' 
    },
    logo: {
        color: '#FFFFFF',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        flex: '0 0 auto'
    },
    navActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '30px',
        flex: '0 0 auto'
    },
    joinLink: {
        color: '#8B0000',
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