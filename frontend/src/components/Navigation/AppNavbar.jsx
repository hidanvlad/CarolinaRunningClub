import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRuns } from '../../context/RunsContext';

const AppNavbar = () => {
    const { currentUser, logout } = useRuns();
    const navigate = useNavigate();

    // If no one is logged in, don't show the navbar at all (keeps Login/Landing clean)
    if (!currentUser) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.brand} onClick={() => navigate('/dashboard')}>
                <span style={styles.logoText}>Carolina Running Club</span>
            </div>




            <div style={styles.links}>
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>

                {/* SILVER: Dedicated link to the full-page chat */}
                <Link to="/chat" style={styles.link}>Club Chat</Link>

                {/* GOLD: Only show Admin Panel if the role is Admin */}
                {currentUser.role === 'Admin' && (
                    <Link to="/admin-panel" style={styles.adminLink}>
                        ⚠️ Admin Oversight
                    </Link>
                )}
            </div>

            <div style={styles.userSection}>
                <div style={styles.userInfo}>
                    <span style={styles.userName}>{currentUser.name}</span>
                    <span style={styles.roleBadge}>{currentUser.role}</span>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px',
        height: '70px',
        backgroundColor: '#1a1a1a',
        borderBottom: '2px solid #8B0000',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    brand: { cursor: 'pointer', display: 'flex', flexDirection: 'column' },
    logoText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: '18px', lineHeight: '1', flex: '0 0 auto' },
    subText: { color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' },
    links: { display: 'flex', gap: '30px', alignItems: 'center' },
    link: { color: '#e0e0e0', textDecoration: 'none', fontWeight: '500', fontSize: '14px', transition: 'color 0.2s' },
    adminLink: {
        color: '#FFD700',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '14px',
        padding: '5px 10px',
        border: '1px solid #FFD700',
        borderRadius: '4px'
    },
    userSection: { display: 'flex', alignItems: 'center', gap: '20px' },
    userInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
    userName: { color: '#fff', fontSize: '14px', fontWeight: 'bold' },
    roleBadge: { color: '#8B0000', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' },
    logoutBtn: {
        backgroundColor: 'transparent',
        border: '1px solid #444',
        color: '#ccc',
        padding: '6px 12px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '12px'
    }
};

export default AppNavbar;