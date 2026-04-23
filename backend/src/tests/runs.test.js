const request = require('supertest');
const app = require('../index');

describe('Runs API CRUD Operations', () => {

    // Reset state before every test to ensure 100% reliability
    beforeEach(async () => {
        await request(app).post('/api/reset');
    });

    // --- COVERING GET & PAGINATION ---
    test('GET /api/runs should return paginated data', async () => {
        const res = await request(app).get('/api/runs?page=1&limit=2');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.length).toBe(2);
    });

    // --- COVERING POST (Success & Validation Error) ---
    test('POST /api/runs should create a new run', async () => {
        const res = await request(app).post('/api/runs').send({ name: "Marathon", date: "2026-05-01" });
        expect(res.statusCode).toEqual(201);
    });

    test('POST /api/runs should fail if name is too short (Line 20)', async () => {
        const res = await request(app).post('/api/runs').send({ name: "Ab", date: "2026-05-01" });
        expect(res.statusCode).toEqual(400); // Covers the validation error path
        expect(res.body).toHaveProperty('error');
    });

    // --- COVERING PUT (Success, Validation Error & 404) ---
    test('PUT /api/runs/:id should update a run', async () => {
        const res = await request(app).put('/api/runs/1').send({ name: "Updated Name" });
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe("Updated Name");
    });

    test('PUT /api/runs/:id should fail if name is too short (Line 30)', async () => {
        const res = await request(app).put('/api/runs/1').send({ name: "Hi" });
        expect(res.statusCode).toEqual(400); // Covers the PUT validation error path
    });

    test('PUT /api/runs/:id should return 404 for missing run', async () => {
        const res = await request(app).put('/api/runs/999').send({ name: "No One" });
        expect(res.statusCode).toEqual(404); // Covers the "not found" path in index.js
    });

    // --- COVERING DELETE (Success & 404) ---
    test('DELETE /api/runs/:id should remove a run', async () => {
        const res = await request(app).delete('/api/runs/1');
        expect(res.statusCode).toEqual(204);
    });

    test('DELETE /api/runs/:id should return 404 for missing run (Line 37)', async () => {
        const res = await request(app).delete('/api/runs/999');
        expect(res.statusCode).toEqual(404); // Covers the "false" return in runsStore.js
    });
});