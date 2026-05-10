import React, { useEffect } from 'react';
import { useRuns } from '../../context/RunsContext';

const AdminPanel = () => {
    const { logs, fetchLogs, observationList, fetchObservationList } = useRuns();

    useEffect(() => {
        // Refresh logs and suspicious users when the page opens
        fetchLogs();
        fetchObservationList();
    }, [fetchLogs, fetchObservationList]);

    return (
        <div style={{ padding: '40px', color: 'white', backgroundColor: '#121212', minHeight: '100vh' }}>
            <h1 style={{ borderLeft: '5px solid #FFD700', paddingLeft: '15px' }}>Admin Oversight</h1>

            <div style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
                {/* GOLD: The Observation List for flagged users */}
                <div style={styles.card}>
                    <h3 style={{ color: '#FF4D4D' }}>⚠️ Observation List (Suspicious Users)</h3>
                    {observationList.length === 0 ? <p style={{ color: '#555' }}>No suspicious activity detected.</p> :
                        observationList.map(entry => (
                            <div key={entry.id} style={styles.entry}>
                                <strong>{entry.userName}</strong>: {entry.reason}
                                <div style={{ fontSize: '10px', color: '#666' }}>{new Date(entry.detectionTimestamp).toLocaleString()}</div>
                            </div>
                        ))
                    }
                </div>

                {/* GOLD: The Full Audit Trail */}
                <div style={styles.card}>
                    <h3 style={{ color: '#8B0000' }}>Action Logs</h3>
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {logs.map(log => (
                            <div key={log.id} style={styles.log}>
                                <small style={{ color: '#888' }}>{new Date(log.timestamp).toLocaleTimeString()}</small> |
                                <strong style={{ color: log.userRole === 'Admin' ? '#FFD700' : '#CD5C5C' }}> {log.userRole}: </strong>
                                {log.actionDescription}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    card: { flex: 1, backgroundColor: '#1E1E1E', padding: '20px', borderRadius: '15px', border: '1px solid #333' },
    entry: { padding: '10px', borderBottom: '1px solid #222', color: '#FFD700', fontSize: '13px' },
    log: { fontSize: '11px', padding: '8px 0', borderBottom: '1px solid #222' }
};

export default AdminPanel;