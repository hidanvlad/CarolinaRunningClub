import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRuns } from '../../context/RunsContext';

const AppNavbar = () => {
    const { currentUser, logout } = useRuns();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!currentUser) return null;

    const isAdmin = currentUser?.role === 'Admin' || currentUser?.email === 'test@email.com';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={{
            ...styles.nav,
            padding: isMobile ? '0 15px' : '0 40px'
        }}>
            <div style={styles.brand} onClick={() => navigate('/dashboard')}>
                <span style={{
                    ...styles.logoText,
                    fontSize: isMobile ? '16px' : '18px'
                }}>
                    {isMobile ? "CRC" : "Carolina Running Club"}
                </span>
            </div>

            <div style={{
                ...styles.links,
                gap: isMobile ? '12px' : '30px'
            }}>
                <Link to="/dashboard" style={styles.link}>Runs</Link>
                <Link to="/chat" style={styles.link}>Chat</Link>
                
                {isAdmin && (
                    <Link to="/admin-panel" style={{
                        ...styles.adminLink,
                        fontSize: isMobile ? '11px' : '14px',
                        padding: isMobile ? '3px 6px' : '5px 10px'
                    }}>
                        {isMobile ? "🛡️" : "⚠️ Oversight"}
                    </Link>
                )}
            </div>

            <div style={{
                ...styles.userSection,
                gap: isMobile ? '8px' : '20px'
            }}>
                <div style={styles.userInfo}>
                    <span style={{ ...styles.userName, display: isMobile ? 'none' : 'block' }}>{currentUser.name || "vlad"}</span>
                    <span style={{ 
                        ...styles.roleBadge,
                        color: isAdmin ? '#FFD700' : '#8B0000'
                    }}>
                        {isAdmin ? "ADMIN" : (currentUser.role || "USER")}
                    </span>
                </div>
                <button onClick={handleLogout} style={{
                    ...styles.logoutBtn,
                    fontSize: isMobile ? '10px' : '12px',
                    padding: isMobile ? '4px 8px' : '6px 12px'
                }}>
                    Out
                </button>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px',
        backgroundColor: '#1a1a1a',
        borderBottom: '2px solid #8B0000',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    brand: { cursor: 'pointer', display: 'flex', flexDirection: 'column' },
    logoText: { color: '#FFFFFF', fontWeight: 'bold', lineHeight: '1', flex: '0 0 auto' },
    links: { display: 'flex', alignItems: 'center' },
    link: { color: '#e0e0e0', textDecoration: 'none', fontWeight: '500', fontSize: '14px', transition: 'color 0.2s' },
    adminLink: {
        color: '#FFD700',
        textDecoration: 'none',
        fontWeight: 'bold',
        border: '1px solid #FFD700',
        borderRadius: '4px'
    },
    userSection: { display: 'flex', alignItems: 'center' },
    userInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
    userName: { color: '#fff', fontSize: '14px', fontWeight: 'bold' },
    roleBadge: { fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' },
    logoutBtn: {
        backgroundColor: 'transparent',
        border: '1px solid #444',
        color: '#ccc',
        borderRadius: '20px',
        cursor: 'pointer'
    }
};

export default AppNavbar;