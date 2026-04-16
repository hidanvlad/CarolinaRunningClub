import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Updated: Redirect to Dashboard after "Login"
        navigate('/dashboard');
    };

    return (
        <div style={styles.page}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => navigate('/')}
                style={styles.backHome}
            >
                ← Back to Club Page
            </motion.div>

            <h1 style={styles.title}>Carolina Running Club</h1>
            <p style={styles.subtitle}>Welcome back</p>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.card}
            >
                <h2 style={styles.formTitle}>Login</h2>
                <p style={styles.formSubtitle}>Enter your credentials to manage runs</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Email</label>
                    <input type="email" style={styles.input} required />

                    <label style={styles.label}>Password</label>
                    <input type="password" style={styles.input} required />

                    <button type="submit" style={styles.btnRed}>Autentificare</button>
                </form>

                <p style={styles.footerText}>
                    Nu ai cont? <span onClick={() => navigate('/register')} style={styles.link}>Înregistrează-te aici</span>
                </p>
            </motion.div>
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#E8E8E8', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' },
    backHome: { position: 'absolute', top: '30px', left: '30px', cursor: 'pointer', fontWeight: 'bold', color: '#8B0000' },
    title: { fontSize: '48px', fontWeight: 'bold', fontStyle: 'italic', marginBottom: '5px', color: '#000' },
    subtitle: { color: '#8B0000', fontWeight: 'bold', marginBottom: '30px' },
    card: { backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '400px' },
    formTitle: { margin: '0 0 5px 0', fontSize: '20px', color: '#8B0000' },
    formSubtitle: { color: '#666', fontSize: '12px', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column' },
    label: { fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#333' },
    input: { padding: '12px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' },
    btnRed: { backgroundColor: '#8B0000', color: 'white', border: 'none', padding: '14px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
    footerText: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#555' },
    link: { color: '#8B0000', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;