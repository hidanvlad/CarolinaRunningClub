import React from 'react';
import event88 from '../../assets/crc-event-88.jpg';
import event97 from '../../assets/crc-event-97.jpg';

const MerchShop = () => {
    const products = [
        {
            name: "Tricou Carolina Running Club - Alb",
            price: "59,99 €",
            img: event88
        },
        {
            name: "Tricou Carolina Running Club - Negru",
            price: "59,99 €",
            img: event97
        }
    ];

    return (
        <section style={styles.section}>
            {/* 1. Professional Site Header (matches example) */}
            <h2 style={styles.title}>OUR APPAREL</h2>

            <div style={styles.grid}>
                {/* Information Card - Proportional & Centered Button */}
                <div style={styles.infoCard}>
                    {/* 2. Red Card Header (matches example) */}
                    <h3 style={styles.infoTitle}>OUR COMMUNITY</h3>
                    <p style={styles.infoText}>
                        Descoperă magazinul nostru — de la tricouri confortabile la accesorii practice.
                    </p>
                    {/* 3. Centered Button (matches example) */}
                    <button style={styles.shopBtn}>LA MAGAZIN →</button>
                </div>

                {/* Product Cards - Vertical proportions are kept */}
                {products.map((p, i) => (
                    <div key={i} style={styles.productCard}>
                        <div style={styles.imgContainer}>
                            <img src={p.img} alt={p.name} style={styles.img} />
                        </div>
                        <h4 style={styles.prodName}>{p.name}</h4>
                        <p style={styles.price}>{p.price}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

const styles = {
    section: {
        backgroundColor: '#121212',
        padding: '80px 40px',
        borderTop: '1px solid #222'
    },
    title: {
        color: '#fff',
        fontSize: '32px',
        marginBottom: '40px',
        fontWeight: 'bold',
        borderLeft: '5px solid #8B0000',
        paddingLeft: '15px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    infoCard: {
        backgroundColor: '#8B0000',
        padding: '40px 30px',
        borderRadius: '15px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center', // Centers button and text
        alignSelf: 'center', // Proportional: Centers vertically in its grid space
        maxWidth: '350px', // Proportional: Prevents it from getting too wide
        margin: '0 auto', // Proportional: Centers horizontally in its grid space
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        // height: '100%' - REMOVED so it fits its content.
    },
    infoTitle: {
        color: '#fff',
        fontSize: '24px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        margin: '0 0 15px 0',
        textAlign: 'center'
    },
    infoText: {
        fontSize: '16px',
        lineHeight: '1.6',
        marginBottom: '30px',
        textAlign: 'center'
    },
    shopBtn: {
        backgroundColor: '#fff',
        color: '#000',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '25px',
        cursor: 'pointer',
        fontWeight: 'bold',
        width: 'fit-content' // Keeps pill shape
    },
    productCard: {
        backgroundColor: '#1e1e1e',
        padding: '15px',
        borderRadius: '15px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column'
    },
    imgContainer: {
        width: '100%',
        height: '450px', // Controls portrait proportions
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '15px'
    },
    img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    prodName: {
        color: '#fff',
        fontSize: '16px',
        margin: '10px 0',
        fontWeight: '600'
    },
    price: {
        color: '#8B0000',
        fontSize: '15px',
        fontWeight: 'bold',
        margin: 0
    }
};

export default MerchShop;