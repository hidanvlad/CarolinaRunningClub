import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialRuns } from '../../data/runsData';

const Dashboard = () => {
    const navigate = useNavigate();
    const [runs, setRuns] = useState(initialRuns);
    const [currentPage, setCurrentPage] = useState(1);
    const runsPerPage = 5;

    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentRunId, setCurrentRunId] = useState(null);
    const [errors, setErrors] = useState({});

    // SILVER CHALLENGE: Cookie State
    const [recentActivity, setRecentActivity] = useState(() => {
        const cookies = document.cookie.split('; ');
        const activityCookie = cookies.find(row => row.startsWith('lastAction='));
        return activityCookie ? decodeURIComponent(activityCookie.split('=')[1]) : '';
    });

    const indexOfLastRun = currentPage * runsPerPage;
    const indexOfFirstRun = indexOfLastRun - runsPerPage;
    const currentRuns = runs.slice(indexOfFirstRun, indexOfLastRun);

    const validateForm = () => {
        const newErrors = {};
        if (name.trim().length < 3) newErrors.name = "Run name must be at least 3 characters.";
        if (!date) {
            newErrors.date = "A valid date is required.";
        } else if (new Date(date) > new Date()) {
            newErrors.date = "Date cannot be in the future.";
        }
        return newErrors;
    };

    const updateMonitoring = (msg) => {
        document.cookie = `lastAction=${encodeURIComponent(msg)}; path=/; max-age=86400`;
        setRecentActivity(msg);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        if (isEditing) {
            setRuns(runs.map(run => run.id === currentRunId ? { ...run, name, date } : run));
            updateMonitoring(`Updated run: ${name}`);
            setIsEditing(false);
            setCurrentRunId(null);
        } else {
            const newRun = { id: Date.now(), name, date, distance: "5km", location: "Alba Iulia" };
            setRuns([newRun, ...runs]);
            updateMonitoring(`Added new run: ${name}`);
        }
        setName(''); setDate(''); setErrors({});
    };

    const handleEditClick = (run) => {
        setIsEditing(true);
        setCurrentRunId(run.id);
        setName(run.name);
        setDate(run.date);
        setErrors({});
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this run?")) {
            const filtered = runs.filter(run => run.id !== id);
            setRuns(filtered);
            updateMonitoring(`Deleted a run at ${new Date().toLocaleTimeString()}`);
            if (currentRuns.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Manage Runs</h1>
                <button onClick={() => navigate('/')} style={styles.btnRed}>Back to Home</button>
            </div>

            {recentActivity && (
                <div style={styles.cookieNotice}>
                    🕒 <strong>Recent Activity:</strong> {recentActivity}
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <h3 style={{ color: isEditing ? '#FFD700' : '#8B0000', margin: '0 0 10px 0' }}>
                    {isEditing ? "Editing Mode" : "Add New Run"}
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input aria-label="Run Name" placeholder="Run Name" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
                    <input aria-label="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.input} />
                    <button type="submit" style={styles.btnRed}>{isEditing ? "Save Changes" : "Add Run"}</button>
                    {isEditing && (
                        <button type="button" onClick={() => { setIsEditing(false); setName(''); setDate(''); }} style={styles.btnCancel}>
                            Cancel
                        </button>
                    )}
                </div>
                {errors.name && <div style={styles.errorText}>{errors.name}</div>}
                {errors.date && <div style={styles.errorText}>{errors.date}</div>}
            </form>

            <table style={styles.table}>
                <thead><tr style={styles.tableHead}><th>Name</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                    {currentRuns.map(run => (
                        <tr key={run.id} style={styles.tableRow}>
                             <td onClick={() => navigate(`/run/${run.id}`)} style={styles.runLink}>{run.name}</td>
                            <td>{run.date}</td>
                            <td>
                                <button onClick={() => handleEditClick(run)} style={styles.btnAction}>Edit</button>
                                <button onClick={() => handleDelete(run.id)} style={styles.btnAction}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={styles.pagination}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={styles.pageBtn}>Prev</button>
                <span style={{ margin: '0 15px' }}>Page {currentPage}</span>
                <button disabled={indexOfLastRun >= runs.length} onClick={() => setCurrentPage(currentPage + 1)} style={styles.pageBtn}>Next</button>
            </div>
        </div>
    );
};

const styles = {
    container: { backgroundColor: '#1E1E1E', minHeight: '100vh', color: 'white', padding: '50px' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
    cookieNotice: { backgroundColor: '#333', padding: '10px', borderRadius: '5px', marginBottom: '20px', borderLeft: '5px solid #8B0000' },
    form: { marginBottom: '30px', backgroundColor: '#2A2A2A', padding: '20px', borderRadius: '8px' },
    input: { padding: '10px', borderRadius: '4px', border: 'none', flex: 1, minWidth: '200px' },
    errorText: { color: '#FF4D4D', fontSize: '12px', marginTop: '5px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHead: { borderBottom: '2px solid #8B0000', color: '#8B0000', textAlign: 'left' },
    tableRow: { borderBottom: '1px solid #333' },
    runLink: { color: '#8B0000', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' },
    btnRed: { backgroundColor: '#8B0000', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px' },
    btnCancel: { backgroundColor: '#555', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px' },
    btnAction: { backgroundColor: '#444', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer' },
    pagination: { marginTop: '20px', textAlign: 'center' },
    pageBtn: { padding: '5px 15px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none' }
};

export default Dashboard;