/* eslint-disable no-undef */
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { faker } = require('@faker-js/faker');
const cors = require('cors');
const runsStore = require('./data/runsStore');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173" }
});

app.use(cors());
app.use(express.json());

let simulationInterval = null;

io.on('connection', (socket) => {
    console.log(` Client connected: ${socket.id}`);
});

// --- SIMULATION ---
app.post('/api/simulation/start', (req, res) => {
    if (simulationInterval) return res.status(400).json({ error: "Already running" });
    simulationInterval = setInterval(() => {
        const newRun = {
            name: `${faker.person.firstName()}'s ${faker.helpers.arrayElement(['Morning', 'Late', 'Sprint'])}`,
            date: new Date().toISOString().split('T')[0],
            distance: `${faker.number.int({ min: 2, max: 15 })}km`,
            type: faker.helpers.arrayElement(['Commute', 'Race', 'Trail', 'Intervals']),
            location: faker.location.city()
        };
        const savedRun = runsStore.add(newRun);
        io.emit('runAdded', savedRun);
    }, 4000);
    res.json({ message: "Simulation started" });
});

app.post('/api/simulation/stop', (req, res) => {
    clearInterval(simulationInterval);
    simulationInterval = null;
    res.json({ message: "Simulation stopped" });
});

// --- CRUD  ---
app.get('/api/runs', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    res.json(runsStore.getPaginated(page, limit));
});


app.get('/api/runs/:id', (req, res) => {
    const run = runsStore.getById(req.params.id);
    if (run) res.json(run);
    else res.status(404).json({ error: "Run not found" });
});

app.post('/api/runs', (req, res) => {
    const { name } = req.body;
    if (!name || name.trim().length < 3) return res.status(400).json({ error: "Name too short" });
    const newRun = runsStore.add(req.body);
    io.emit('runAdded', newRun);
    res.status(201).json(newRun);
});

app.delete('/api/runs/:id', (req, res) => {
    const deleted = runsStore.remove(req.params.id);
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: "Run not found" });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`🚀 Real-time Server running on http://localhost:${PORT}`);
});

// GET all runners for dropdowns and filtering
app.get('/api/runners', (req, res) => {
    res.json(runsStore.getAllRunners());
});

// Update POST /api/runs to ensure runnerId is handled
app.post('/api/runs', (req, res) => {
    const { name, runnerId } = req.body;
    if (!name || name.trim().length < 3) return res.status(400).json({ error: "Name too short" });
    if (!runnerId) return res.status(400).json({ error: "Runner is required" });

    const newRun = runsStore.add(req.body);
    io.emit('runAdded', newRun);
    res.status(201).json(newRun);
});