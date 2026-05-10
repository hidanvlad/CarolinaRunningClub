import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav style={navStyles.navbarFixed}>
            <style>
                {`
                @keyframes drawFortress {
                    0% { stroke-dashoffset: 450; opacity: 0.3; }
                    50% { opacity: 1; }
                    100% { stroke-dashoffset: 0; opacity: 0.3; }
                }
                `}
            </style>
            <div style={{
                ...navStyles.navContainer,
                padding: isMobile ? '0 15px' : '0 5%'
            }}>
                {/* Logo text shrinks on mobile */}
                <div style={{
                    ...navStyles.logo,
                    fontSize: isMobile ? '14px' : '18px'
                }} onClick={() => navigate('/')}>
                    {isMobile ? "CRC" : "Carolina Running Club"}
                </div>

                <div style={navStyles.animationSpace}>
                    <svg
                        width={isMobile ? "80" : "125"}
                        height={isMobile ? "80" : "125"}
                        viewBox="0 0 100 100"
                        style={{ overflow: 'visible' }}
                    >
                        <path
                            d="M 51 ,34 L 57 ,41 L 65 ,42 L 62 ,50 L 65 ,57 L 57 ,59 L 52 ,65 L 46 ,63 L 38 ,65 L 36 ,57 L 29 ,53 L 35 ,47 L 35 ,39 L 44 ,39 L 51 ,34 Z"
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

                <div style={{
                    ...navStyles.navActions,
                    gap: isMobile ? '12px' : '30px'
                }}>
                    <span
                        style={navStyles.joinLink}
                        onClick={() => navigate('/register')}
                    >
                        Join
                    </span>
                    <button
                        style={{
                            ...navStyles.loginButton,
                            padding: isMobile ? '6px 15px' : '8px 25px',
                            fontSize: isMobile ? '12px' : '14px'
                        }}
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
        width: '100%', // Changed from 100vw to prevent horizontal scroll
        boxSizing: 'border-box',
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
        boxSizing: 'border-box'
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
        fontWeight: 'bold',
        cursor: 'pointer',
        flex: '0 0 auto',
        whiteSpace: 'nowrap'
    },
    navActions: {
        display: 'flex',
        alignItems: 'center',
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
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    }
};

export default Navbar;