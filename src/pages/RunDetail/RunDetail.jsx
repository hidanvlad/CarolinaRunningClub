import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initialRuns } from '../runsData';

const RunDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find the run in your data
    const run = initialRuns.find(r => r.id === parseInt(id));

    if (!run) {
        return <div style={{ color: 'white', padding: '100px' }}>Run not found!</div>;
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
                    <p><strong>Date:</strong> {run.date}</p>
                    <p><strong>Distance:</strong> {run.distance}</p>
                    <p><strong>Location:</strong> {run.location || "Alba Iulia"}</p>
                </div>

                <p style={styles.desc}>
                    This is a community run organized by the Carolina Running Club.
                    Get ready for an amazing atmosphere and great people!
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: { backgroundColor: '#1E1E1E', minHeight: '100vh', color: 'white', padding: '100px 50px' },
    backBtn: { backgroundColor: 'transparent', color: '#8B0000', border: '1px solid #8B0000', padding: '10px 20px', cursor: 'pointer', marginBottom: '30px' },
    card: { backgroundColor: '#2A2A2A', padding: '40px', borderRadius: '15px', maxWidth: '800px', margin: '0 auto' },
    title: { color: '#8B0000', fontSize: '36px', margin: 0 },
    subtitle: { opacity: 0.7, margin: '5px 0 20px 0' },
    hr: { borderColor: '#444', marginBottom: '20px' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '18px' },
    desc: { marginTop: '30px', lineHeight: '1.6', fontSize: '16px' }
};

export default RunDetail;