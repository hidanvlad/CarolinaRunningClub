/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRuns } from '../../context/RunsContext';
import { motion } from 'framer-motion';

const RunFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addRun, updateRun, getRunById, runners, activityTypes } = useRuns();

    const [formData, setFormData] = useState({
        name: '',
        userId: '',
        date: new Date().toISOString().split('T')[0],
        distance: '',
        activityTypeId: ''
    });

    useEffect(() => {
        if (id) {
            getRunById(id).then(data => {
                if (data) setFormData({
                    ...data,
                    userId: data.userId || '',
                    activityTypeId: data.activityTypeId || ''
                });
            });
        }
    }, [id, getRunById]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // GOLD: Passing 1 (Admin) as the actorId so the backend logs the action
        const actorId = 1;

        if (id) {
            // If ID exists, we are UPDATING
            await updateRun(id, formData, actorId);
        } else {
            // If no ID, we are ADDING
            await addRun(formData, actorId);
        }

        navigate('/dashboard');
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.page}>
            <div style={styles.card}>
                <h2 style={{ color: '#8B0000', marginBottom: '20px' }}>
                    {id ? `Editing Run #${id}` : "Add New Run"}
                </h2>
                <form onSubmit={handleSubmit} style={styles.gridForm}>
                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                        <label style={styles.label}>Select Runner</label>
                        <select
                            value={formData.userId}
                            onChange={e => setFormData({ ...formData, userId: e.target.value })}
                            style={styles.input}
                            required
                        >
                            <option value="">-- Choose Runner --</option>
                            {runners.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Run Title</label>
                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={styles.input} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Date</label>
                        <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={styles.input} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Distance (km)</label>
                        <input placeholder="5.0" value={formData.distance} onChange={e => setFormData({ ...formData, distance: e.target.value })} style={styles.input} required />
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
                        {id ? "Save Changes & Log" : "Add Run & Log"}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard')} style={styles.btnCancel}>Cancel</button>
                </form>
            </div>
        </motion.div>
    );
};

const styles = {
    page: { backgroundColor: '#121212', minHeight: '100vh', padding: '50px' },
    card: { backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '15px', maxWidth: '600px', margin: '0 auto', border: '1px solid #333' },
    gridForm: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '11px', color: '#888', fontWeight: 'bold' },
    input: { padding: '12px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#121212', color: 'white' },
    btnSave: { backgroundColor: '#8B0000', color: 'white', border: 'none', padding: '15px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
    btnCancel: { backgroundColor: 'transparent', color: '#888', border: '1px solid #444', padding: '15px', borderRadius: '5px', cursor: 'pointer' }
};

export default RunFormPage;