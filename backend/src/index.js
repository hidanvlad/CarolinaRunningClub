/* eslint-disable no-undef */
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { faker } = require('@faker-js/faker');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const runsStore = require('./data/runsStore');
const { typeDefs, resolvers } = require('./schema');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

// 1. Apply CORS
app.use(cors());

// 2. FIXED: Apply JSON parsing only to simulation routes using correct prefix syntax
// This avoids the "Missing parameter name" error in Express 5
app.use('/api/simulation', express.json());

let simulationInterval = null;

async function startApollo() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
    });

    await apolloServer.start();

    // 3. Apply Apollo middleware (it handles its own parsing for /graphql)
    apolloServer.applyMiddleware({ app });

    const PORT = 5000;
    // 4. Start listening ONLY after Apollo is ready
    server.listen(PORT, () => {
        console.log(`🚀 GraphQL ready at http://localhost:5000${apolloServer.graphqlPath}`);
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}

startApollo();

// --- WEBSOCKETS & SIMULATION (Silver Requirements) ---
io.on('connection', (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);
});

app.post('/api/simulation/start', (req, res) => {
    if (simulationInterval) return res.status(400).json({ error: "Already running" });
    simulationInterval = setInterval(() => {
        const newRun = {
            runnerId: faker.helpers.arrayElement([1, 2]),
            name: `${faker.person.firstName()}'s ${faker.helpers.arrayElement(['Morning', 'Late', 'Sprint'])}`,
            date: new Date().toISOString().split('T')[0],
            distance: `${faker.number.int({ min: 2, max: 15 })}km`,
            type: faker.helpers.arrayElement(['Commute', 'Race', 'Trail', 'Intervals']),
            location: faker.location.city()
        };
        const savedRun = runsStore.add(newRun);
        io.emit('runAdded', savedRun); // [cite: 9]
    }, 4000);
    res.json({ message: "Simulation started" });
});

app.post('/api/simulation/stop', (req, res) => {
    clearInterval(simulationInterval);
    simulationInterval = null;
    res.json({ message: "Simulation stopped" });
});