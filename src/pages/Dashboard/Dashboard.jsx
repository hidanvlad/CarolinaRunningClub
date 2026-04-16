import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRuns } from '../../context/RunsContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, PieChart, Pie, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { runs, addRun, deleteRun } = useRuns();
    const navigate = useNavigate();

    // 1. SIMULATION TOGGLE STATE
    const [isSimulating, setIsSimulating] = useState(false);

    // 2. PAGINATION STATE
    const [currentPage, setCurrentPage] = useState(1);
    const runsPerPage = 7;
    const totalPages = Math.ceil(runs.length / runsPerPage);
    const indexOfLastRun = currentPage * runsPerPage;
    const indexOfFirstRun = indexOfLastRun - runsPerPage;
    const currentRuns = runs.slice(indexOfFirstRun, indexOfLastRun);

    // EFFECT: Automated Simulation Logic
    useEffect(() => {
        let interval = null;
        if (isSimulating) {
            interval = setInterval(() => {
                const types = ['Commute', 'Race', 'Trail', 'Intervals'];
                const mockNames = ['Urban Sprint', 'Valley Run', 'Sunset Trail', 'Bridge Interval'];
                const randomType = types[Math.floor(Math.random() * types.length)];
                const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];

                const mockRun = {
                    id: Date.now(),
                    name: `${randomName} (Live)`,
                    date: new Date().toISOString().split('T')[0],
                    distance: `${Math.floor(Math.random() * 8) + 2}km`,
                    location: "Alba Iulia",
                    type: randomType,
                    description: "Automated simulation run."
                };
                addRun(mockRun);
            }, 1000); // Adds a run every 1 second
        }
        return () => clearInterval(interval); // Cleanup when stopped
    }, [isSimulating, addRun]);

    // Data Calculation for Charts
    const types = ['Commute', 'Race', 'Trail', 'Intervals'];
    const chartData = types.map(type => ({
        name: type,
        value: runs.filter(r => r.type === type).length
    })).filter(data => data.value > 0);

    const COLORS = ['#8B0000', '#B22222', '#CD5C5C', '#E57373'];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.mainTitle}>Management Alergări</h1>
                <div style={{ display: 'flex', gap: '15px' }}>
                    {/* TOGGLE BUTTON */}
                    <button
                        onClick={() => setIsSimulating(!isSimulating)}
                        style={isSimulating ? styles.btnStop : styles.btnSimulate}
                    >
                        {isSimulating ? "🛑 Stop Stream" : "⚡ Live Simulation"}
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
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Type</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode='popLayout'>
                                    {currentRuns.map(run => (
                                        <motion.tr
                                            key={run.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            style={styles.tableRow}
                                        >
                                            <td onClick={() => navigate(`/run/${run.id}`)} style={styles.runLink}>{run.name}</td>
                                            <td style={styles.typeCell}>{run.type}</td>
                                            <td>
                                                <button onClick={() => navigate(`/edit-run/${run.id}`)} style={styles.btnAction}>Edit</button>
                                                <button onClick={() => deleteRun(run.id)} style={styles.btnAction}>Delete</button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION UI */}
                    <div style={styles.pagination}>
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} style={styles.pageBtn}>Prev</button>
                        <span style={styles.pageInfo}>Page <strong>{currentPage}</strong> of {totalPages || 1}</span>
                        <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => prev + 1)} style={styles.pageBtn}>Next</button>
                    </div>
                </div>

                <div style={styles.rightPanel}>
                    <h3 style={styles.chartTitle}>Statistics Dashboard</h3>
                    <div style={styles.chartsFlex}>
                        <div style={{ height: '220px', flex: 1 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                                    <XAxis dataKey="name" stroke="#CCC" fontSize={10} />
                                    <YAxis stroke="#CCC" fontSize={10} />
                                    <Bar dataKey="value" fill="#8B0000" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ height: '220px', flex: 1 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={chartData} innerRadius={50} outerRadius={70} dataKey="value">
                                        {chartData.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div style={styles.totalBadge}>Total Runs Recorded: {runs.length}</div>
                </div>
            </div>
        </motion.div>
    );
};

const styles = {
    container: { backgroundColor: '#121212', minHeight: '100vh', color: '#F0F0F0', padding: '40px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    mainTitle: { fontSize: '28px', borderLeft: '5px solid #8B0000', paddingLeft: '15px' },
    mainLayout: { display: 'flex', gap: '30px', flexWrap: 'wrap' },
    leftPanel: { flex: 1.2, minWidth: '400px' },
    rightPanel: { flex: 1.8, minWidth: '500px', backgroundColor: '#1E1E1E', padding: '25px', borderRadius: '15px', border: '1px solid #333' },
    tableWrapper: { backgroundColor: '#1E1E1E', borderRadius: '12px', padding: '10px', border: '1px solid #333', minHeight: '450px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHead: { borderBottom: '2px solid #8B0000' },
    th: { textAlign: 'left', padding: '12px', color: '#888', fontSize: '12px', textTransform: 'uppercase' },
    tableRow: { borderBottom: '1px solid #222' },
    runLink: { color: '#FF4D4D', cursor: 'pointer', fontWeight: 'bold', padding: '15px 12px', display: 'inline-block' },
    typeCell: { color: '#AAA', fontSize: '14px' },
    btnRed: { backgroundColor: '#8B0000', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '30px', fontWeight: 'bold' },
    btnSimulate: { backgroundColor: '#FFD700', color: '#121212', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '30px', fontWeight: 'bold' },
    btnStop: { backgroundColor: '#FFF', color: '#8B0000', border: '1px solid #8B0000', padding: '10px 20px', cursor: 'pointer', borderRadius: '30px', fontWeight: 'bold' },
    btnLogout: { backgroundColor: 'transparent', color: '#FFF', border: '1px solid #FFF', padding: '10px 20px', cursor: 'pointer', borderRadius: '30px', fontWeight: 'bold' },
    btnAction: { backgroundColor: '#333', color: '#FFF', border: 'none', padding: '6px 10px', marginRight: '5px', cursor: 'pointer', borderRadius: '4px', fontSize: '11px' },
    pagination: { marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' },
    pageBtn: { backgroundColor: '#333', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', opacity: 1 },
    pageInfo: { fontSize: '14px', color: '#CCC' },
    chartsFlex: { display: 'flex', gap: '10px', marginTop: '20px' },
    chartTitle: { textAlign: 'center', color: '#FFF', fontSize: '18px' },
    totalBadge: { marginTop: '20px', textAlign: 'center', padding: '15px', fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }
};

export default Dashboard;