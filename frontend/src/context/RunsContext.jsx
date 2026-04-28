/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const RunsContext = createContext();
const socket = io('http://localhost:5000');

const gqlRequest = async (query, variables = {}) => {
    const res = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
    });
    const result = await res.json();
    return result.data;
};

export const RunsProvider = ({ children }) => {
    const [runs, setRuns] = useState([]);
    const [runners, setRunners] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [pendingActions, setPendingActions] = useState([]); // SILVER: Sync Queue [cite: 5, 6]

    // SILVER: Heartbeat and Sync Effect 
    useEffect(() => {
        if (!isOffline && pendingActions.length > 0) {
            const syncData = async () => {
                toast.info("Re-connected. Syncing data...");
                for (const action of pendingActions) {
                    if (action.type === 'ADD') {
                        await addRun(action.data, true); // true avoids re-adding to queue
                    }
                }
                setPendingActions([]);
                toast.success("Synchronization complete!");
            };
            syncData();
        }
    }, [isOffline, pendingActions]);

    const fetchRunners = useCallback(async () => {
        try {
            const data = await gqlRequest(`query { runners { id name level } }`);
            if (data) {
                setRunners(data.runners);
                setIsOffline(false);
            }
        } catch { setIsOffline(true); }
    }, []);

    const fetchRuns = useCallback(async (page = 1, limit = 7, append = false) => {
        const query = `
            query GetRuns($page: Int, $limit: Int) {
                runs(page: $page, limit: $limit) {
                    totalItems totalPages currentPage
                    data { id runnerId name date distance type location }
                }
            }
        `;
        try {
            const data = await gqlRequest(query, { page, limit });
            const result = data.runs;
            setRuns(prev => append ? [...prev, ...result.data] : result.data);
            setPagination({ totalItems: result.totalItems, totalPages: result.totalPages });
            setHasMore(page < result.totalPages);
            setIsOffline(false);
        } catch {
            setIsOffline(true);
        } finally {
            setLoading(false);
        }
    }, []);

    // Updated addRun with sync support 
    const addRun = async (newRun, isSyncing = false) => {
        const tempRun = { ...newRun, id: Date.now(), isPending: true };

        if (isOffline && !isSyncing) {
            setRuns(prev => [tempRun, ...prev]);
            setPendingActions(prev => [...prev, { type: 'ADD', data: newRun }]);
            return;
        }

        const mutation = `
            mutation Add($name: String!, $rId: Int!, $date: String!, $dist: String, $type: String!, $loc: String) {
                addRun(name: $name, runnerId: $rId, date: $date, distance: $dist, type: $type, location: $loc) { id }
            }
        `;
        try {
            await gqlRequest(mutation, {
                name: newRun.name,
                rId: parseInt(newRun.runnerId),
                date: newRun.date,
                dist: newRun.distance,
                type: newRun.type,
                loc: newRun.location
            });
            if (!isSyncing) fetchRuns(1, 7, false);
        } catch {
            if (!isSyncing) {
                setIsOffline(true);
                setRuns(prev => [tempRun, ...prev]);
                setPendingActions(prev => [...prev, { type: 'ADD', data: newRun }]);
            }
        }
    };

    // GOLD: Added Update logic for full CRUD completeness 
    const updateRun = async (id, updatedData) => {
        const mutation = `
            mutation Update($id: ID!, $name: String, $rId: Int, $dist: String, $type: String) {
                updateRun(id: $id, name: $name, runnerId: $rId, distance: $dist, type: $type) { id }
            }
        `;
        try {
            await gqlRequest(mutation, { id, ...updatedData, rId: parseInt(updatedData.runnerId) });
            fetchRuns(1, 7, false);
        } catch { setIsOffline(true); }
    };

    const deleteRun = async (id) => {
        if (isOffline) {
            setRuns(prev => prev.filter(r => r.id !== id));
            return;
        }
        await gqlRequest(`mutation Del($id: ID!) { deleteRun(id: $id) }`, { id });
        fetchRuns(1, 7, false);
    };

    const getRunById = async (id) => {
        const data = await gqlRequest(`query GetRun($id: ID!) { run(id: $id) { id name date distance type location runnerId } }`, { id });
        return data ? data.run : null;
    };

    useEffect(() => { fetchRuns(); fetchRunners(); }, [fetchRuns, fetchRunners]);

    useEffect(() => {
        socket.on('runAdded', (newRun) => {
            setRuns(prev => [newRun, ...prev]);
            toast.info(`🏃 New Run: ${newRun.name}!`, { position: "bottom-right", theme: "dark" });
        });
        return () => socket.off('runAdded');
    }, []);

    return (
        <RunsContext.Provider value={{
            runs, runners, pagination, loading, isOffline, hasMore,
            fetchRuns, addRun, updateRun, deleteRun, getRunById
        }}>
            {children}
        </RunsContext.Provider>
    );
};
export const useRuns = () => useContext(RunsContext);