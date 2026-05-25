import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../config';

const Login = () => {
    const navigate = useNavigate();

    // Stările pentru Logarea în 2 Pași
    const [loginStep, setLoginStep] = useState(1); // 1 = Credențiale, 2 = Introducere OTP Email
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');

    // Stările pentru Modalul de Recuperare Parolă (Sincronizat Complet)
    const [showRecovery, setShowRecovery] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [recoveryAnswer, setRecoveryAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [recoveryStep, setRecoveryStep] = useState(1); // 1 = Cerere Email, 2 = Răspuns la Întrebare + Parolă Nouă

    const BASE_URL = API_BASE_URL;

    // PASUL 1 LOGARE: Trimitere Credențiale -> Solicitare OTP
    const handleStep1Submit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/Auth/send-login-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                setLoginStep(2); // Schimbă vizual pagina cardului la pasul 2
                toast.success('Credențiale corecte! Codul OTP a fost generat în consolă.');
            } else {
                const errorText = await res.text();
                toast.error(errorText || "Email sau parolă incorectă.");
            }
        } catch {
            toast.error("Eroare de conexiune la server.");
        }
    };

    // PASUL 2 LOGARE: Introducere OTP -> Finalizare Logare JWT
    const handleFinalizeLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/Auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, securityPassphrase: otpCode })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success(`Autentificat cu succes! Bun venit.`);

                navigate('/dashboard');
                window.location.reload();
            } else {
                toast.error("Codul OTP introdus este incorect.");
            }
        } catch {
            toast.error("Eroare la procesarea autentificării.");
        }
    };

    // RECUPERARE PASUL 1: Cere întrebarea din baza de date pe baza emailului
    const handleFetchQuestion = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/Auth/get-question`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: recoveryEmail })
            });

            if (res.ok) {
                const data = await res.json();
                setSecurityQuestion(data.question);
                setRecoveryStep(2); // Deblochează pasul 2 în interiorul modalului!
                toast.success("Identitate găsită! Răspundeți la întrebare.");
            } else {
                toast.error("Adresa de email nu există în baza de date.");
            }
        } catch {
            toast.error("Eroare de comunicare cu serverul.");
        }
    };

    // RECUPERARE PASUL 2: Trimite răspunsul și salvează noua parolă în SQL
    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/Auth/recover-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: recoveryEmail, answer: recoveryAnswer, newPassword })
            });

            if (res.ok) {
                toast.success("Parola a fost actualizată! Vă puteți loga.");
                setShowRecovery(false); // Închide modalul automat
                setRecoveryStep(1); // Resetează modalul pentru utilizări viitoare
                setRecoveryEmail(''); setRecoveryAnswer(''); setNewPassword('');
            } else {
                toast.error("Răspunsul la întrebarea de siguranță este greșit.");
            }
        } catch {
            toast.error("Eroare la salvarea noii parole.");
        }
    };

    return (
        <div style={styles.page}>
            <motion.div onClick={() => navigate('/')} style={styles.backHome}>
                ← Back to Club Page
            </motion.div>

            <h1 style={styles.title}>Carolina Running Club</h1>
            <p style={styles.subtitle}>Welcome back</p>

            <motion.div key={loginStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={styles.card}>
                <h2 style={styles.formTitle}>Login (Secure Gateway)</h2>
                <p style={styles.formSubtitle}>
                    {loginStep === 1 ? "Pasul 1: Introduceți credențialele" : "Pasul 2: Introduceți codul primit pe e-mail"}
                </p>

                {loginStep === 1 ? (
                    <form onSubmit={handleStep1Submit} style={styles.form}>
                        <label style={styles.label}>Email Address</label>
                        <input type="email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hidan.vlad@test.com" required />

                        <label style={styles.label}>Account Password</label>
                        <input type="password" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />

                        <button type="submit" style={styles.btnRed}>Continuă spre OTP →</button>
                    </form>
                ) : (
                    <form onSubmit={handleFinalizeLogin} style={styles.form}>
                        <label style={styles.label}>Cod Verificare E-mail (MFA OTP)</label>
                        <input type="text" style={{ ...styles.input, borderColor: '#8B0000', textAlign: 'center', fontSize: '22px', letterSpacing: '4px', fontWeight: 'bold' }}
                            value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="000000" maxLength="6" required />

                        <button type="submit" style={{ ...styles.btnRed, backgroundColor: '#333' }}>Verifică și Conectează 🔓</button>
                        <button type="button" onClick={() => setLoginStep(1)} style={styles.btnCancel}>← Înapoi la credențiale</button>
                    </form>
                )}

                {loginStep === 1 && (
                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                        <span onClick={() => setShowRecovery(true)} style={styles.recoveryLink}>Forgot Password / Recovery?</span>
                    </div>
                )}

                <p style={styles.footerText}>Nu ai cont? <span onClick={() => navigate('/register')} style={styles.link}>Înregistrează-te aici</span></p>
            </motion.div>

            {/* MODALUL DE RECUPERARE PAROLĂ - CORECTAT ȘI PERFECT FUNCȚIONAL */}
            {showRecovery && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={{ color: '#8B0000', margin: '0 0 15px 0' }}>Secure Account Recovery</h3>

                        {recoveryStep === 1 ? (
                            <form onSubmit={handleFetchQuestion}>
                                <label style={styles.label}>Introduceți adresa de Email</label>
                                <input type="email" style={styles.input} value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} placeholder="user@test.com" required />
                                <button type="submit" style={styles.btnRed}>Verifică Identitate</button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <div style={{ backgroundColor: '#F9F9F9', padding: '10px', borderRadius: '5px', marginBottom: '15px', borderLeft: '4px solid #8B0000' }}>
                                    <p style={{ fontSize: '13px', color: '#333', margin: 0, textAlign: 'left' }}><strong>Întrebare:</strong> {securityQuestion}</p>
                                </div>

                                <label style={styles.label}>Răspunsul tău de siguranță</label>
                                <input type="text" style={styles.input} value={recoveryAnswer} onChange={(e) => setRecoveryAnswer(e.target.value)} placeholder="Introduceți răspunsul" required />

                                <label style={styles.label}>Noua Parolă Secure</label>
                                <input type="password" style={styles.input} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required />

                                <button type="submit" style={styles.btnRed}>Actualizează Parola</button>
                            </form>
                        )}
                        <button type="button" onClick={() => { setShowRecovery(false); setRecoveryStep(1); }} style={styles.btnCancel}>Închide</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#E8E8E8', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif', position: 'relative' },
    backHome: { position: 'absolute', top: '30px', left: '30px', cursor: 'pointer', fontWeight: 'bold', color: '#8B0000' },
    title: { fontSize: '48px', fontWeight: 'bold', fontStyle: 'italic', marginBottom: '5px', color: '#000', textAlign: 'center' },
    subtitle: { color: '#8B0000', fontWeight: 'bold', marginBottom: '30px' },
    card: { backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '400px', boxSizing: 'border-box' },
    formTitle: { margin: '0 0 5px 0', fontSize: '20px', color: '#8B0000', textAlign: 'center' },
    formSubtitle: { color: '#666', fontSize: '12px', marginBottom: '20px', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column' },
    label: { fontWeight: 'bold', marginBottom: '5px', fontSize: '13px', color: '#333' },
    input: { padding: '12px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' },
    btnRed: { backgroundColor: '#8B0000', color: 'white', border: 'none', padding: '14px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', width: '100%', marginTop: '5px' },
    recoveryLink: { color: '#666', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' },
    footerText: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#555' },
    link: { color: '#8B0000', cursor: 'pointer', fontWeight: 'bold' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 },
    modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '380px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
    btnCancel: { backgroundColor: 'transparent', color: '#666', border: '1px solid #ccc', padding: '10px', borderRadius: '25px', cursor: 'pointer', width: '100%', marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }
};

export default Login;