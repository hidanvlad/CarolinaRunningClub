/* eslint-disable no-undef */
// backend/src/data/runsStore.js

let runners = [
    { id: 1, name: "Hidan Vlad", level: "Intermediate" },
    { id: 2, name: "Bardea Andrei", level: "Elite" }
];

let initialRuns = [
    { id: 1, runnerId: 1, name: "Morning Jog", date: "2026-04-10", distance: "5km", type: "Trail" },
    { id: 2, runnerId: 2, name: "City Sprint", date: "2026-04-12", distance: "3km", type: "Race" },
    { id: 3, runnerId: 1, name: "Morning Run", date: "2026-04-17", distance: "6km", type: "Commute" },
    { id: 4, runnerId: 2, name: "Vo2MAX", date: "2026-04-18", distance: "7km", type: "Intervals" },
    { id: 5, runnerId: 1, name: "Morning Long Run", date: "2026-04-21", distance: "10km", type: "Commute" }
];


let shopCategories = [
    { id: 1, name: "Official Apparel" },
    { id: 2, name: "Equipment & Gear" }
];

let shopItems = [
    { id: 101, categoryId: 1, name: "Club Jersey 2026", price: 180, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300" },
    { id: 102, categoryId: 1, name: "Performance Shorts", price: 120, img: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=300" },
    { id: 103, categoryId: 2, name: "Hydration Vest", price: 350, img: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=300" },
    { id: 104, categoryId: 2, name: "Running Cap", price: 65, img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300" }
];

let runs = [...initialRuns];

module.exports = {
    reset: () => { runs = [...initialRuns]; },
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
    },


    getAllCategories: () => shopCategories,
    getItemsByCategory: (catId) => shopItems.filter(item => item.categoryId === parseInt(catId))
};