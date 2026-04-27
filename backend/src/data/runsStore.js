/* eslint-disable no-undef */
// backend/src/data/runsStore.js

let runners = [
    { id: 1, name: "Hidan Vlad", level: "Intermediate" },
    { id: 2, name: "Bardea Andrei", level: "Elite" }
];

let initialData = [
    { id: 1, runnerId: 1, name: "Morning Jog", date: "2026-04-10", distance: "5km", type: "Trail" },
    { id: 2, runnerId: 2, name: "City Sprint", date: "2026-04-12", distance: "3km", type: "Race" },
    { id: 3, runnerId: 1, name: "Morning Run", date: "2026-04-17", distance: "6km", type: "Commute" },
    { id: 4, runnerId: 2, name: "Vo2MAX", date: "2026-04-18", distance: "7km", type: "Intervals" },
    { id: 5, runnerId: 1, name: "Morning Long Run", date: "2026-04-21", distance: "10km", type: "Commute" }
];
let runs = [...initialData];

module.exports = {
    reset: () => { runs = [...initialData]; },
    getAllRunners: () => runners,
    getRunsByRunner: (runnerId) => runs.filter(r => r.runnerId === parseInt(runnerId)),
    getById: (id) => runs.find(r => r.id === parseInt(id)),
    getPaginated: (page, limit) => {
        const startIndex = (page - 1) * limit;
        return {
            totalItems: runs.length,
            totalPages: Math.ceil(runs.length / limit),
            currentPage: page,
            data: runs.slice(startIndex, startIndex + limit)
        };
    },
    add: (run) => {
        const newRun = { ...run, id: Date.now() };
        runs.unshift(newRun);
        return newRun;
    },
    remove: (id) => {
        const initialLength = runs.length;
        runs = runs.filter(r => r.id !== parseInt(id));
        return runs.length !== initialLength;
    }
};