import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRuns } from '../../context/RunsContext';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const { runs, runners, pagination, fetchRuns, deleteRun, loading, isOffline, hasMore } = useRuns();
    const navigate = useNavigate();
    const [isSimulating, setIsSimulating] = useState(false);
    const [page, setPage] = useState(1);

    const COLORS = ['#8B0000', '#B22222', '#CD5C5C', '#E57373'];

    // Statistics for 1-to-many: Count runs for each runner
    const runnerStats = runners.map(r => ({
        name: r.name.split(' ')[0], // Use first name for space
        value: runs.filter(run => run.runnerId === r.id).length
    })).filter(d => d.value > 0);

    const typeStats = ['Commute', 'Race', 'Trail', 'Intervals'].map(type => ({
        name: type,
        value: runs.filter(r => r.type === type).length
    })).filter(d => d.value > 0);

    const toggleSimulation = async () => {
        const endpoint = isSimulating ? 'stop' : 'start';
        await fetch(`http://localhost:5000/api/simulation/${endpoint}`, { method: 'POST' });
        setIsSimulating(!isSimulating);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isOffline) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchRuns(nextPage, 7, true);
                }
            }, { threshold: 1.0 }
        );
        const anchor = document.querySelector('#scroll-anchor');
        if (anchor) observer.observe(anchor);
        return () => { if (anchor) observer.unobserve(anchor); };
    }, [hasMore, page, fetchRuns, isOffline]);

    if (loading) return <div style={{ color: 'white', padding: '50px' }}>Loading Dashboard...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
            <ToastContainer />
            <div style={styles.header}>
                <h1 style={styles.mainTitle}>Management Alergări</h1>
                <div style={styles.buttonGroup}>
                    <button onClick={toggleSimulation} style={isSimulating ? styles.btnStop : styles.btnSimulate}>
                        {isSimulating ? "Stop Stream" : "Live Simulation"}
                    </button>
                    <button onClick={() => navigate('/add-run')} style={styles.btnRed}>+ Add Run</button>
                    <button onClick={() => navigate('/')} style={styles.btnLogout}>Logout</button>
                </div>
            </div>

            <div style={styles.mainLayout}>
                <div style={styles.leftPanel}>
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHead}>
                                    <th>Name</th>
                                    <th>Runner (1-to-Many)</th> {/* REVEAL RELATIONSHIP */}
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {runs.map(run => {
                                    const runner = runners.find(r => r.id === run.runnerId);
                                    return (
                                        <tr key={run.id} style={styles.tableRow}>
                                            <td onClick={() => navigate(`/run/${run.id}`)} style={styles.runLink}>{run.name}</td>
                                            <td style={{ color: '#888' }}>{runner ? runner.name : "Unassigned"}</td>
                                            <td style={styles.typeCell}>{run.type}</td>
                                            <td>
                                                <button onClick={() => navigate(`/edit-run/${run.id}`)} style={styles.btnAction}>Edit</button>
                                                <button onClick={() => deleteRun(run.id)} style={styles.btnAction}>Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div id="scroll-anchor" style={styles.anchor}>{hasMore ? "Loading more..." : "End of List"}</div>
                    </div>
                </div>

                <div style={styles.rightPanel}>
                    <h3 style={styles.chartTitle}>Runs per Runner (Stats)</h3>
                    <div style={{ height: '200px', marginBottom: '20px' }}>
                        <ResponsiveContainer>
                            <BarChart data={runnerStats}>
                                <CartesianGrid stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#CCC" fontSize={10} />
                                <YAxis stroke="#CCC" fontSize={10} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#FFD700" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <h3 style={styles.chartTitle}>Distribution by Type</h3>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={typeStats} innerRadius={50} outerRadius={70} dataKey="value">
                                    {typeStats.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const styles = {
    container: { backgroundColor: '#121212', minHeight: '100vh', color: '#F0F0F0', padding: '40px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    mainTitle: { fontSize: '28px', borderLeft: '5px solid #8B0000', paddingLeft: '15px' },
    buttonGroup: { display: 'flex', gap: '10px' },
    mainLayout: { display: 'flex', gap: '30px' },
    leftPanel: { flex: 1.5 },
    rightPanel: { flex: 1, backgroundColor: '#1E1E1E', padding: '20px', borderRadius: '15px' },
    tableWrapper: { backgroundColor: '#1E1E1E', borderRadius: '12px', padding: '10px', maxHeight: '550px', overflowY: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHead: { borderBottom: '2px solid #8B0000', textAlign: 'left', color: '#888', fontSize: '12px' },
    tableRow: { borderBottom: '1px solid #222' },
    runLink: { color: '#FF4D4D', cursor: 'pointer', padding: '12px', display: 'inline-block', fontWeight: 'bold' },
    typeCell: { color: '#AAA' },
    btnRed: { backgroundColor: '#8B0000', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' },
    btnSimulate: { backgroundColor: '#FFD700', padding: '8px 16px', borderRadius: '20px', border: 'none' },
    btnLogout: { backgroundColor: 'transparent', color: '#FFF', border: '1px solid #FFF', padding: '8px 16px', borderRadius: '20px' },
    btnAction: { backgroundColor: '#333', color: '#FFF', border: 'none', padding: '5px 10px', borderRadius: '4px', marginRight: '5px' },
    anchor: { padding: '20px', textAlign: 'center', color: '#555' },
    chartTitle: { textAlign: 'center', color: '#888', fontSize: '14px', marginBottom: '10px' }
};
export default Dashboard;