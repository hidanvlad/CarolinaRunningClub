import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRuns } from '../../context/RunsContext';
import Chat from '../../components/Chat/Chat';

const ChatPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useRuns();

    return (
        <div style={styles.container}>
            <div style={styles.chatWindow}>
                {/* Header that looks like a Direct Message header */}
                <div style={styles.header}>
                    <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>←</button>
                    <div style={styles.headerInfo}>
                        <span style={styles.headerTitle}>Club Members</span>
                        <span style={styles.onlineStatus}>Active Now</span>
                    </div>
                </div>

                <div style={styles.chatBody}>
                    <Chat currentUser={currentUser?.name || "Guest"} />
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#000',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    chatWindow: {
        width: '100%',
        maxWidth: '500px',
        height: '90vh',
        backgroundColor: '#121212',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #262626'
    },
    header: {
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #262626',
        gap: '15px'
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer'
    },
    headerInfo: { display: 'flex', flexDirection: 'column' },
    headerTitle: { fontWeight: 'bold', color: 'white', fontSize: '16px' },
    onlineStatus: {
        color: '#4f8832',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    chatBody: { flex: 1, overflow: 'hidden' }
};

export default ChatPage;