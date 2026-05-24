/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRuns } from '../../context/RunsContext';
import { motion } from 'framer-motion';

const RunFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addRun, updateRun, getRunById, runners, activityTypes, currentUser } = useRuns();

    const [formData, setFormData] = useState({
        name: '',
        userId: '',
        date: new Date().toISOString().split('T')[0],
        distance: '',
        activityTypeId: ''
    });

    // 1. Prepare the runner list: SQL Runners + the Current Guest (if applicable)
    const runnerOptions = [...runners];
    if (currentUser && currentUser.id === 0) {
        const exists = runnerOptions.find(r => r.id === 0);
        if (!exists) {
            runnerOptions.push({ id: 0, name: currentUser.name + " (Guest)" });
        }
    }

    useEffect(() => {
        if (id) {
            // EDIT MODE
            getRunById(id).then(data => {
                if (data) setFormData({
                    ...data,
                    userId: data.userId || '',
                    activityTypeId: data.activityTypeId || ''
                });
            });
        } else if (currentUser) {
            // NEW RUN: Auto-select the logged in user
            setFormData(prev => ({ ...prev, userId: currentUser.id.toString() }));
        }
    }, [id, getRunById, currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Dynamically set the actor ID for the Audit Log
        // If no user is found, default to 0
        const actorId = currentUser?.id ?? 0;

        if (id) {
            await updateRun(id, formData, actorId);
        } else {
            await addRun(formData, actorId);
        }

        navigate('/dashboard');
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.page}>
            <div style={styles.card}>
                <h2 style={{ color: '#8B0000', marginBottom: '20px', fontSize: '22px' }}>
                    {id ? `Editing Run #${id}` : "Add New Run"}
                </h2>

                <form onSubmit={handleSubmit} style={styles.gridForm}>
                    {/* Select Runner - Now includes Guest */}
                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                        <label style={styles.label}>Select Runner</label>
                        <select
                            value={formData.userId}
                            onChange={e => setFormData({ ...formData, userId: e.target.value })}
                            style={styles.input}
                            required
                        >
                            <option value="">-- Choose Runner --</option>
                            {runnerOptions.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Run Title</label>
                        <input
                            placeholder="Evening Sprints"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Distance (km)</label>
                        <input
                            type="number"
                            step="0.1"
                            placeholder="5.0"
                            value={formData.distance}
                            onChange={e => setFormData({ ...formData, distance: e.target.value })}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Activity Type</label>
                        <select
                            value={formData.activityTypeId}
                            onChange={e => setFormData({ ...formData, activityTypeId: e.target.value })}
                            style={styles.input}
                            required
                        >
                            <option value="">-- Select Type --</option>
                            {activityTypes.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.typeName || t.TypeName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" style={styles.btnSave}>
                        {id ? "Update Run" : "Save Run"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        style={styles.btnCancel}
                    >
                        Back to Dashboard
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

const styles = {
    page: {
        backgroundColor: '#121212',
        minHeight: '100vh',
        padding: '50px 20px',
        display: 'flex',
        alignItems: 'center'
    },
    card: {
        backgroundColor: '#1E1E1E',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '600px',
        width: '100%',
        margin: '0 auto',
        border: '1px solid #333',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    },
    gridForm: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
    },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' },
    input: {
        padding: '12px',
        borderRadius: '5px',
        border: '1px solid #333',
        backgroundColor: '#121212',
        color: 'white',
        fontSize: '14px',
        outline: 'none'
    },
    btnSave: {
        backgroundColor: '#8B0000',
        color: 'white',
        border: 'none',
        padding: '15px',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
        gridColumn: 'span 2',
        marginTop: '10px',
        transition: 'background 0.2s'
    },
    btnCancel: {
        backgroundColor: 'transparent',
        color: '#888',
        border: '1px solid #444',
        padding: '15px',
        borderRadius: '5px',
        cursor: 'pointer',
        gridColumn: 'span 2'
    }
};

export default RunFormPage;