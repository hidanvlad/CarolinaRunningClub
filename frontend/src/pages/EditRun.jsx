import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRuns } from '../context/RunsContext';

const EditRun = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getRunById, updateRun } = useRuns();
    const [formData, setFormData] = useState({ name: '', distance: '', userId: '', activityTypeId: '' });

    useEffect(() => {
        const loadRun = async () => {
            const data = await getRunById(id);
            if (data) setFormData(data);
        };
        loadRun();
    }, [id, getRunById]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // GOLD: We pass '1' (Hidan Vlad) as the actorId for the log
        await updateRun(id, formData, 1);
        navigate('/dashboard');
    };

    if (!formData.name) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

    return (
        <div style={{ padding: '40px', color: 'white', backgroundColor: '#121212', minHeight: '100vh' }}>
            <h2 style={{ borderLeft: '5px solid #8B0000', paddingLeft: '15px' }}>Edit Run #{id}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
                <input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Run Name"
                    style={formStyles.input}
                />
                <input
                    value={formData.distance}
                    onChange={e => setFormData({ ...formData, distance: e.target.value })}
                    placeholder="Distance (km)"
                    style={formStyles.input}
                />
                <button type="submit" style={formStyles.btn}>Save Gold Log & Update</button>
                <button type="button" onClick={() => navigate('/dashboard')} style={formStyles.btnCancel}>Cancel</button>
            </form>
        </div>
    );
};

const formStyles = {
    input: { padding: '12px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#1E1E1E', color: 'white' },
    btn: { backgroundColor: '#8B0000', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    btnCancel: { backgroundColor: 'transparent', color: '#888', border: 'none', cursor: 'pointer' }
};

export default EditRun;