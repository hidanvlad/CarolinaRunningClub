import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRuns } from '../../context/RunsContext';
import { motion } from 'framer-motion';

const Shop = () => {
    const navigate = useNavigate();
    const { currentUser } = useRuns();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Administrative layout interaction states
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', imageUrl: 'http://localhost:5048/images/sapca.jpg' });
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchCatalog = () => {
        fetch('http://localhost:5048/api/Products')
            .then(res => {
                if (!res.ok) throw new Error("Catalog fetch error mapping entries.");
                return res.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading products:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCatalog();
    }, []);

    // Secure Network REST Token Header Configuration
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // CRUD: CREATE NEW INVENTORY LOG
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5048/api/Products', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: newProduct.name,
                    price: parseFloat(newProduct.price),
                    imageUrl: newProduct.imageUrl
                })
            });
            if (res.ok) {
                setNewProduct({ name: '', price: '', imageUrl: 'http://localhost:5048/images/sapca.jpg' });
                fetchCatalog();
            }
        } catch (err) { console.error("Creation endpoint failed:", err); }
    };

    // CRUD: UPDATE INVENTORY DETAILS
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5048/api/Products/${editingProduct.id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(editingProduct)
            });
            if (res.ok) {
                setEditingProduct(null);
                fetchCatalog();
            }
        } catch (err) { console.error("Update endpoint failed:", err); }
    };

    // CRUD: REMOVE ENTRY FROM SPECIFICATION TABLES
    const handleDelete = async (id) => {
        if (!window.confirm("Sigur dorești să ștergi acest produs din catalogul magazinului?")) return;
        try {
            const res = await fetch(`http://localhost:5048/api/Products/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) fetchCatalog();
        } catch (err) { console.error("Deletion endpoint failed:", err); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
            <div style={styles.header}>
                <button onClick={() => navigate(-1)} style={styles.btnBack}>← Înapoi</button>
                <h1 style={styles.title}>Magazin Oficial CRC</h1>
                <p style={styles.subtitle}>Poartă culorile clubului la următorul tău antrenament!</p>

                {/* Secure Checkpoint Gate unlocking admin privileges interface hooks */}
                {currentUser?.role === 'Admin' && (
                    <button onClick={() => setIsAdminMode(!isAdminMode)} style={styles.btnToggleAdmin}>
                        {isAdminMode ? "🛒 Vezi Mod Utilizator" : "🛠️ Deschide Management Catalog"}
                    </button>
                )}
            </div>

            {/* DYNAMIC MANAGEMENT AREA DISPLAY */}
            {currentUser?.role === 'Admin' && isAdminMode && (
                <div style={styles.adminPanelWrapper}>
                    <h2 style={{ color: '#FFD700', fontSize: '16px', marginBottom: '15px' }}>
                        {editingProduct ? "📝 Editează Informații Produs" : "✨ Adaugă Produs Nou în Baza de Date"}
                    </h2>
                    <form onSubmit={editingProduct ? handleUpdate : handleCreate} style={styles.formGrid}>
                        <input type="text" placeholder="Nume Produs" required style={styles.input}
                            value={editingProduct ? editingProduct.name : newProduct.name}
                            onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })} />

                        <input type="number" step="0.01" placeholder="Preț (€)" required style={styles.input}
                            value={editingProduct ? editingProduct.price : newProduct.price}
                            onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) }) : setNewProduct({ ...newProduct, price: e.target.value })} />

                        <input type="text" placeholder="URL Cale Imagine Locală" required style={styles.input}
                            value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl}
                            onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, imageUrl: e.target.value }) : setNewProduct({ ...newProduct, imageUrl: e.target.value })} />

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" style={styles.btnSubmit}>
                                {editingProduct ? "Salvează Modificări" : "Adaugă în SQL Table"}
                            </button>
                            {editingProduct && (
                                <button type="button" onClick={() => setEditingProduct(null)} style={styles.btnCancel}>Anulează</button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>Se încarcă produsele din baza de date...</div>
            ) : (
                <div style={styles.grid}>
                    {products.map(product => (
                        <div key={product.id} style={styles.card}>
                            <img src={product.imageUrl} alt={product.name} style={styles.productImg} />
                            <div style={styles.cardInfo}>
                                <h3 style={styles.productName}>{product.name}</h3>
                                <span style={styles.price}>{product.price.toFixed(2)} €</span>

                                {currentUser?.role === 'Admin' && isAdminMode ? (
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                        <button onClick={() => setEditingProduct(product)} style={styles.btnEdit}>Modifică</button>
                                        <button onClick={() => handleDelete(product.id)} style={styles.btnDelete}>Şterge</button>
                                    </div>
                                ) : (
                                    <button onClick={() => alert(`"${product.name}" a fost adăugat în coș!`)} style={styles.btnBuy}>
                                        Adaugă în coș
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

const styles = {
    container: { backgroundColor: '#121212', minHeight: '100vh', color: '#FFF', padding: '40px 20px', fontFamily: 'sans-serif' },
    header: { textAlign: 'center', marginBottom: '50px' },
    btnBack: { backgroundColor: 'transparent', color: '#888', border: 'none', cursor: 'pointer', fontSize: '14px', marginBottom: '15px', display: 'block', margin: '0 auto' },
    title: { fontSize: '32px', fontWeight: 'bold', margin: '0 0 10px 0', borderBottom: '3px solid #8B0000', display: 'inline-block', paddingBottom: '5px' },
    subtitle: { color: '#888', fontSize: '14px', margin: '0 0 20px 0' },
    btnToggleAdmin: { backgroundColor: '#FFD700', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' },
    adminPanelWrapper: { backgroundColor: '#1E1E1E', padding: '20px', borderRadius: '15px', border: '1px solid #FFD700', maxWidth: '700px', margin: '0 auto 40px auto' },
    formGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
    input: { backgroundColor: '#121212', color: '#fff', border: '1px solid #333', padding: '10px', borderRadius: '8px', fontSize: '14px' },
    btnSubmit: { backgroundColor: '#8B0000', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    btnCancel: { backgroundColor: '#444', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' },
    card: { backgroundColor: '#1E1E1E', borderRadius: '15px', border: '1px solid #333', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    productImg: { width: '100%', height: '280px', objectFit: 'cover' },
    cardInfo: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
    productName: { fontSize: '15px', fontWeight: 'bold', margin: 0, color: '#F0F0F0' },
    price: { color: '#FF4D4D', fontWeight: 'bold', fontSize: '16px' },
    btnBuy: { backgroundColor: '#8B0000', color: 'white', border: 'none', padding: '10px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
    btnEdit: { flex: 1, backgroundColor: '#333', color: '#FFF', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
    btnDelete: { flex: 1, backgroundColor: '#8B0000', color: '#FFF', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }
};

export default Shop;