import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRuns } from '../../context/RunsContext';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const { runs, runners, fetchRuns, deleteRun, loading, currentUser } = useRuns();
    const navigate = useNavigate();
    const [isSimulating, setIsSimulating] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 900);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const COLORS = ['#8B0000', '#B22222', '#CD5C5C', '#E57373'];

    // Display all runs for Admin, or only own runs for User
    const displayedRuns = currentUser?.role === 'Admin'
        ? runs
        : runs.filter(r => Number(r.userId) === currentUser?.id);

    const runnerStats = runners.map(r => ({
        name: r.name.split(' ')[0],
        value: runs.filter(run => Number(run.userId) === Number(r.id)).length
    })).filter(d => d.value > 0);

    const typeStats = [...new Set(displayedRuns.map(r => r.type))].map(type => ({
        name: type,
        value: displayedRuns.filter(r => r.type === type).length
    })).filter(d => d.value > 0);

    const toggleSimulation = async () => {
        const endpoint = isSimulating ? 'stop' : 'start';
        try {
            const res = await fetch(`http://localhost:5048/api/Simulation/${endpoint}`, {
                method: 'POST'
            });
            if (res.ok) {
                setIsSimulating(!isSimulating);
                await fetchRuns();
            }
        } catch (err) {
            console.error("Simulation failed.");
        }
    };

    if (loading) return <div style={{ color: 'white', padding: '50px' }}>Loading Dashboard...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ ...styles.container, padding: isMobile ? '15px' : '40px' }}>
            <ToastContainer />

            <div style={{ ...styles.header, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center' }}>
                <div style={{ borderLeft: '5px solid #8B0000', paddingLeft: '15px' }}>
                    <h1 style={styles.mainTitle}>Management Runs</h1>
                    <span style={{ color: '#888', fontSize: '12px' }}>
                        View mode: <strong style={{ color: currentUser?.role === 'Admin' ? '#FFD700' : '#CD5C5C' }}>{currentUser?.role}</strong>
                    </span>
                </div>

                <div style={{ ...styles.buttonGroup, width: isMobile ? '100%' : 'auto', flexWrap: 'wrap' }}>
                    {currentUser?.role === 'Admin' && (
                        <button onClick={toggleSimulation} style={isSimulating ? styles.btnStop : styles.btnSimulate}>
                            {isSimulating ? "Stop Stream" : "Live Simulation"}
                        </button>
                    )}
                    <button onClick={() => navigate('/add-run')} style={styles.btnRed}>+ Add Run</button>
                </div>
            </div>

            <div style={{ ...styles.mainLayout, flexDirection: isMobile ? 'column' : 'row' }}>
                <div style={{ ...styles.leftPanel, width: '100%' }}>
                    <div style={styles.tableWrapper}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.tableHead}>
                                        <th>Name</th>
                                        <th>Runner</th>
                                        {!isMobile && <th>Type</th>}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedRuns.map(run => (
                                        <tr key={run.id} style={styles.tableRow}>
                                            <td onClick={() => navigate(`/run/${run.id}`)} style={styles.runLink}>{run.name}</td>
                                            <td style={{ color: '#888', fontSize: '13px' }}>
                                                {runners.find(r => Number(r.id) === Number(run.userId))?.name || "Unassigned"}
                                            </td>
                                            {!isMobile && <td style={styles.typeCell}>{run.type}</td>}
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                <button onClick={() => navigate(`/edit-run/${run.id}`)} style={styles.btnAction}>Edit</button>
                                                <button onClick={() => {
                                                    if (window.confirm("Confirm deletion?")) deleteRun(run.id);
                                                }} style={styles.btnAction}>Del</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div style={{ ...styles.rightPanel, width: isMobile ? '100%' : 'auto' }}>
                    <h3 style={styles.chartTitle}>Runs per Runner</h3>
                    <div style={{ height: '220px', minWidth: '300px', marginBottom: '30px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={runnerStats}>
                                <CartesianGrid stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#CCC" fontSize={10} />
                                <YAxis stroke="#CCC" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }} />
                                <Bar dataKey="value" fill="#8B0000" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <h3 style={styles.chartTitle}>Distribution by Type</h3>
                    <div style={{ height: '220px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={typeStats} innerRadius={55} outerRadius={75} dataKey="value" nameKey="name" paddingAngle={5}>
                                    {typeStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const styles = {
    container: { backgroundColor: '#121212', minHeight: '100vh', color: '#F0F0F0' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '15px' },
    mainTitle: { fontSize: '26px', margin: 0 },
    buttonGroup: { display: 'flex', gap: '10px' },
    mainLayout: { display: 'flex', gap: '30px' },
    leftPanel: { flex: 1.6 },
    rightPanel: { flex: 1, backgroundColor: '#1E1E1E', padding: '20px', borderRadius: '15px', border: '1px solid #333' },
    tableWrapper: { backgroundColor: '#1E1E1E', borderRadius: '12px', padding: '10px', minHeight: '300px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHead: { borderBottom: '2px solid #8B0000', textAlign: 'left', color: '#888', fontSize: '12px' },
    tableRow: { borderBottom: '1px solid #222' },
    runLink: { color: '#FF4D4D', cursor: 'pointer', padding: '12px 5px', fontSize: '14px', fontWeight: 'bold' },
    typeCell: { color: '#AAA', fontSize: '13px' },
    btnRed: { backgroundColor: '#8B0000', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
    btnSimulate: { backgroundColor: '#FFD700', color: 'black', border: 'none', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' },
    btnStop: { backgroundColor: '#FFF', color: '#8B0000', border: 'none', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' },
    btnAction: { backgroundColor: '#333', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '10px', marginRight: '5px', cursor: 'pointer' },
    chartTitle: { textAlign: 'center', color: '#888', fontSize: '13px', marginBottom: '10px' },
};

export default Dashboard;