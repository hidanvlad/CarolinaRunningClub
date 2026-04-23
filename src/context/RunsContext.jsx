/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const RunsContext = createContext();
const socket = io('http://localhost:5000');

export const RunsProvider = ({ children }) => {
    const [runs, setRuns] = useState([]);
    const [runners, setRunners] = useState([]); // NEW: 1-to-many Parent state
    const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);
    const [pendingActions, setPendingActions] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    // Fetch runners (The "1" in 1-to-many)
    const fetchRunners = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/runners');
            const data = await response.json();
            setRunners(data);
        } catch (err) { console.error("Runners fetch failed", err); }
    }, []);

    const fetchRuns = useCallback(async (page = 1, limit = 7, append = false) => {
        try {
            const response = await fetch(`http://localhost:5000/api/runs?page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error("Server error");
            const result = await response.json();
            setRuns(prev => append ? [...prev, ...result.data] : result.data);
            setPagination({ totalPages: result.totalPages, totalItems: result.totalItems });
            setHasMore(page < result.totalPages);
            setIsOffline(false);
        } catch (err) { setIsOffline(true); } finally { setLoading(false); }
    }, []);

    const getRunById = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/runs/${id}`);
            return response.ok ? await response.json() : null;
        } catch { return null; }
    };

    const addRun = async (newRun) => {
        const tempRun = { ...newRun, id: Date.now(), isPending: true };
        if (isOffline) {
            setRuns(prev => [tempRun, ...prev]);
            setPendingActions(prev => [...prev, { type: 'ADD', data: newRun }]);
            return;
        }
        try {
            await fetch('http://localhost:5000/api/runs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRun)
            });
            fetchRuns(1, 7, false);
        } catch {
            setIsOffline(true);
            setRuns(prev => [tempRun, ...prev]);
            setPendingActions(prev => [...prev, { type: 'ADD', data: newRun }]);
        }
    };

    const deleteRun = async (id) => {
        if (isOffline) {
            setRuns(prev => prev.filter(r => r.id !== id));
            return;
        }
        try {
            await fetch(`http://localhost:5000/api/runs/${id}`, { method: 'DELETE' });
            fetchRuns(1, 7, false);
        } catch { setIsOffline(true); }
    };

    useEffect(() => {
        fetchRuns();
        fetchRunners(); // Initial load for both entities
    }, [fetchRuns, fetchRunners]);

    return (
        <RunsContext.Provider value={{
            runs, runners, pagination, loading, isOffline, hasMore, fetchRuns, addRun, deleteRun, getRunById
        }}>
            {children}
        </RunsContext.Provider>
    );
};
export const useRuns = () => useContext(RunsContext);