import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRuns } from '../../context/RunsContext';
import { motion } from 'framer-motion';

const RunFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { runs, addRun, updateRun } = useRuns();

    const [formData, setFormData] = useState({
        name: '', date: '', distance: '', location: '', type: 'Trail', description: ''
    });

    useEffect(() => {
        if (id) {
            const runToEdit = runs.find(r => r.id === parseInt(id));
            if (runToEdit) setFormData(runToEdit);
        }
    }, [id, runs]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            updateRun({ ...formData, id: parseInt(id) });
        } else {
            addRun({ ...formData, id: Date.now() });
        }
        navigate('/dashboard');
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.page}>
            <div style={styles.card}>
                <h2 style={{ color: '#8B0000' }}>{id ? "Edit Run" : "Add New Run"}</h2>
                <form onSubmit={handleSubmit} style={styles.gridForm}>
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
                        <input placeholder="e.g. 5km" value={formData.distance} onChange={e => setFormData({ ...formData, distance: e.target.value })} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Location</label>
                        <input placeholder="City or Trail name" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={styles.input} />
                    </div>
                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                        <label style={styles.label}>Type of Run</label>
                        <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={styles.input}>
                            <option value="Commute">Commute</option>
                            <option value="Race">Race</option>
                            <option value="Trail">Trail</option>
                            <option value="Intervals">Intervals</option>
                        </select>
                    </div>
                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                        <label style={styles.label}>Description</label>
                        <textarea rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={styles.input} />
                    </div>

                    <button type="submit" style={styles.btnSave}>Save Run Data</button>
                    <button type="button" onClick={() => navigate('/dashboard')} style={styles.btnCancel}>Cancel</button>
                </form>
            </div>
        </motion.div>
    );
};

const styles = {
    page: { backgroundColor: '#1E1E1E', minHeight: '100vh', padding: '50px', color: 'white' },
    card: { backgroundColor: '#2A2A2A', padding: '30px', borderRadius: '15px', maxWidth: '700px', margin: '0 auto', border: '1px solid #444' },
    gridForm: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '14px', fontWeight: 'bold', color: '#888' },
    input: { padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#1E1E1E', color: 'white' },
    btnSave: { backgroundColor: '#8B0000', color: 'white', border: 'none', padding: '15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    btnCancel: { backgroundColor: '#444', color: 'white', border: 'none', padding: '15px', borderRadius: '5px', cursor: 'pointer' }
};

export default RunFormPage;