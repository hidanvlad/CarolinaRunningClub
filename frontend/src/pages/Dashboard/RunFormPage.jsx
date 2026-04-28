/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRuns } from '../../context/RunsContext';
import { motion } from 'framer-motion';

const RunFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addRun, getRunById, runners } = useRuns();

    const [formData, setFormData] = useState({
        name: '',
        runnerId: '',
        date: new Date().toISOString().split('T')[0],
        distance: '',
        location: '',
        type: 'Trail'
    });

    useEffect(() => {
        if (id) {
            getRunById(id).then(data => { if (data) setFormData(data); });
        }
    }, [id, getRunById]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addRun(formData);
        navigate('/dashboard');
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.page}>
            <div style={styles.card}>
                <h2 style={{ color: '#8B0000', marginBottom: '20px' }}>{id ? "Edit Run" : "Add New Run"}</h2>
                <form onSubmit={handleSubmit} style={styles.gridForm}>
                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                        <label style={styles.label}>Select Runner</label>
                        <select
                            value={formData.runnerId}
                            onChange={e => setFormData({ ...formData, runnerId: parseInt(e.target.value) })}
                            style={styles.input}
                            required
                        >
                            <option value="">-- Choose Runner --</option>
                            {runners.map(r => (
                                <option key={r.id} value={r.id}>{r.name} ({r.level})</option>
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
                        <label style={styles.label}>Distance</label>
                        <input placeholder="5km" value={formData.distance} onChange={e => setFormData({ ...formData, distance: e.target.value })} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Type</label>
                        <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={styles.input}>
                            <option value="Commute">Commute</option>
                            <option value="Race">Race</option>
                            <option value="Trail">Trail</option>
                            <option value="Intervals">Intervals</option>
                        </select>
                    </div>
                    <button type="submit" style={styles.btnSave}>Save Run</button>
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