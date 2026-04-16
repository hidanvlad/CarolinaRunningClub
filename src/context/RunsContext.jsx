import React, { createContext, useState, useContext } from 'react';
import { initialRuns } from '../data/runsData';

const RunsContext = createContext();

export const RunsProvider = ({ children }) => {
    const [runs, setRuns] = useState(initialRuns);

    const addRun = (newRun) => setRuns([newRun, ...runs]);
    const updateRun = (updatedRun) => setRuns(runs.map(r => r.id === updatedRun.id ? updatedRun : r));
    const deleteRun = (id) => setRuns(runs.filter(r => r.id !== id));

    return (
        <RunsContext.Provider value={{ runs, addRun, updateRun, deleteRun }}>
            {children}
        </RunsContext.Provider>
    );
};

export const useRuns = () => useContext(RunsContext);