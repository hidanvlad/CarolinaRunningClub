import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                {/* Coloana Contact */}
                <div style={styles.column}>
                    <h4 style={styles.heading}>CONTACT US</h4>
                    <p style={styles.text}>Email: contact@carolinarun.ro</p>
                    <p style={styles.text}>Tel: +40 7xx xxx xxx</p>
                    <p style={styles.text}>Locație: Alba Iulia, România</p>
                </div>

                {/* Coloana About */}
                <div style={styles.column}>
                    <h4 style={styles.heading}>ABOUT</h4>
                    <p style={styles.text}>Misiunea noastră</p>
                    <p style={styles.text}>Echipa CRC</p>
                    <p style={styles.text}>Parteneri</p>
                </div>

                {/* Coloana Social Media */}
                <div style={styles.column}>
                    <h4 style={styles.heading}>SOCIAL MEDIA</h4>
                    <p style={styles.text}>Facebook</p>
                    <p style={styles.text}>Instagram</p>
                    <p style={styles.text}>Strava</p>
                </div>
            </div>

            {/* Drepturi de autor - Best Practice */}
            <div style={styles.copyright}>
                © 2026 Carolina Running Club. Toate drepturile rezervate.
            </div>
        </footer>
    );
};

const COLORS = {
    red: '#8B0000',
    white: '#FFFFFF',
    black: '#000000'
};

const styles = {
    footer: {
        backgroundColor: COLORS.black, // Fundal negru conform Figma
        color: COLORS.white,
        padding: '50px 0 20px 0',
        marginTop: 'auto'
    },
    container: {
        display: 'flex',
        justifyContent: 'space-around',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    heading: {
        color: COLORS.red, // Titlurile coloanelor in rosu
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '10px'
    },
    text: {
        fontSize: '14px',
        margin: 0,
        opacity: '0.8' // Alb usor transparent pentru un aspect mai fin
    },
    copyright: {
        textAlign: 'center',
        paddingTop: '40px',
        fontSize: '12px',
        opacity: '0.5',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: '30px'
    }
};

export default Footer;