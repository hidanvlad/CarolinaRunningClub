import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initialRuns } from "../../data/runsData";

const RunDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const run = initialRuns.find(r => r.id === parseInt(id));

    if (!run) {
        return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Run not found!</div>;
    }

    return (
        <div style={styles.container}>
            <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
                ← Back to Dashboard
            </button>

            <div style={styles.card}>
                <h1 style={styles.title}>{run.name}</h1>
                <p style={styles.subtitle}>Run Details & Statistics</p>
                <hr style={styles.hr} />

                <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Date:</span>
                        <span style={styles.value}>{run.date}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Distance:</span>
                        <span style={styles.value}>{run.distance || 'N/A'}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Location:</span>
                        <span style={styles.value}>{run.location || "Alba Iulia"}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Type:</span>
                        <span style={styles.value}>{run.type || "Trail"}</span>
                    </div>
                </div>

                <div style={styles.descSection}>
                    <h3 style={{ color: '#FF4D4D', marginBottom: '10px' }}>Description</h3>
                    <p style={styles.desc}>
                        {run.description || "This is a community run organized by the Carolina Running Club. Get ready for an amazing atmosphere and great people!"}
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
    title: { color: '#FF4D4D', fontSize: '42px', margin: 0, fontWeight: 'bold' },
    subtitle: { color: '#AAA', margin: '5px 0 20px 0', fontSize: '18px' },
    hr: { borderColor: '#333', marginBottom: '30px' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' },
    infoItem: { fontSize: '18px' },
    label: { color: '#8B0000', fontWeight: 'bold', marginRight: '10px' },
    value: { color: '#F0F0F0' },
    descSection: { borderTop: '1px solid #333', paddingTop: '20px' },
    desc: { lineHeight: '1.8', fontSize: '16px', color: '#CCC' }
};

export default RunDetail;