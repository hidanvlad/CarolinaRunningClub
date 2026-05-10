import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRuns } from '../../context/RunsContext';

const RunDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getRunById } = useRuns();
    const [run, setRun] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await getRunById(id);
            setRun(data);
            setLoading(false);
        };
        load();
    }, [id, getRunById]);

    if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Syncing data from server...</div>;
    if (!run) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Run not found!</div>;

    return (
        <div style={styles.container}>
            <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
                ← Back to Dashboard
            </button>

            <div style={styles.card}>
                <h1 style={styles.title}>{run.name || "Morning Run"}</h1>
                <p style={styles.subtitle}>System Activity ID: {id}</p>
                <hr style={styles.hr} />

                <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Type:</span>
                        <span style={styles.value}>{run.type || "Jogging"}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Distance:</span>
                        <span style={styles.value}>{run.distance} km</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Date:</span>
                        <span style={styles.value}>{new Date(run.date).toLocaleDateString()}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Location:</span>
                        <span style={styles.value}>{run.location || "Alba Iulia"}</span>
                    </div>
                </div>

                <div style={styles.descSection}>
                    <h3 style={{ color: '#FF4D4D', marginBottom: '10px' }}>SQL Data Log</h3>
                    <p style={styles.desc}>
                        Activity persisted via Entity Framework Core from SQL Server instance.
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { backgroundColor: '#121212', minHeight: '100vh', color: 'white', padding: '80px 50px' },
    backBtn: { backgroundColor: 'transparent', color: '#FF4D4D', border: '1px solid #FF4D4D', padding: '10px 20px', cursor: 'pointer', marginBottom: '30px', borderRadius: '4px', fontWeight: 'bold' },
    card: { backgroundColor: '#292828', padding: '40px', borderRadius: '15px', maxWidth: '800px', margin: '0 auto', border: '1px solid #333' },
    title: { color: '#FF4D4D', fontSize: '36px', margin: 0, fontWeight: 'bold' },
    subtitle: { color: '#AAA', margin: '5px 0 20px 0', fontSize: '14px' },
    hr: { borderColor: '#333', marginBottom: '30px', borderStyle: 'solid', borderWidth: '1px 0 0 0' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' },
    infoItem: { fontSize: '16px' },
    label: { color: '#8B0000', fontWeight: 'bold', marginRight: '10px' },
    value: { color: '#F0F0F0' },
    descSection: { borderTop: '1px solid #333', paddingTop: '20px' },
    desc: { lineHeight: '1.6', fontSize: '15px', color: '#CCC' }
};

export default RunDetail;