import React from 'react';

const InfoCards = () => {
    const cardData = [
        { title: "Events", desc: "Vezi calendarul de alergări și locațiile noastre.", icon: "📅" },
        { title: "Community", desc: "Poze și clipuri de la ultimele evenimente realizate", icon: "👥" },
        { title: "Shop Merch", desc: "Poartă culorile clubului: tricouri și accesorii oficiale.", icon: "🛍️" }
    ];

    return (
        <section style={styles.container}>
            {cardData.map((card, index) => (
                <div key={index} style={styles.card}>
                    <div style={styles.icon}>{card.icon}</div>
                    <h3 style={styles.title}>{card.title}</h3>
                    <p style={styles.text}>{card.desc}</p>
                </div>
            ))}
        </section>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px 40px 60px', backgroundColor: '#FFFFFF' },
    card: { flex: 1, backgroundColor: '#F0F0F0', padding: '30px', borderRadius: '20px', textAlign: 'center', maxWidth: '350px' },
    icon: { fontSize: '30px', marginBottom: '10px', color: '#8B0000' },
    title: { fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' },
    text: { fontSize: '14px', color: '#333', lineHeight: '1.5' }
};

export default InfoCards;