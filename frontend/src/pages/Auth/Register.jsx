import React from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Register = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>Carolina Running Club</h1>
            <p style={styles.subtitle}>Start your journey</p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={styles.card}
            >
                <h2 style={styles.formTitle}>Creează un cont</h2>
                <p style={styles.formSubtitle}>Register to be updated</p>

                <form style={styles.form} onSubmit={(e) => { e.preventDefault(); navigate('/login'); }}>
                    <label style={styles.label}>Email</label>
                    <input type="email" style={styles.input} required />

                    <label style={styles.label}>Password</label>
                    <input type="password" style={styles.input} required />

                    <label style={styles.label}>Confirm Password</label>
                    <input type="password" style={styles.input} required />

                    <button type="submit" style={styles.btnRed}>Înregistrare</button>
                </form>

                <p style={styles.footerText}>
                    Already have an account? <span onClick={() => navigate('/login')} style={styles.link}>Login</span>
                </p>
            </motion.div>
        </div>
    );
};

// Use the same styles as Login.jsx
const styles = {
    page: { backgroundColor: '#E8E8E8', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' },
    title: { fontSize: '48px', fontWeight: 'bold', fontStyle: 'italic', color: '#000' },
    subtitle: { color: '#8B0000', fontWeight: 'bold', marginBottom: '30px' },
    card: { backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '400px' },
    formTitle: { margin: '0', fontSize: '20px', color: '#8B0000' },
    formSubtitle: { color: '#696969', fontSize: '12px', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column' },
    label: { fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' },
    input: { padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#242424' },
    btnRed: { backgroundColor: '#8B0000', color: 'white', border: 'none', padding: '12px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' },
    footerText: { textAlign: 'center', marginTop: '20px' },
    link: { color: '#8B0000', cursor: 'pointer', fontWeight: 'bold' }
};

export default Register;