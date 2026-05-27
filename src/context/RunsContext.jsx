/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { GRAPHQL_URL, WS_URL, DEFAULT_PAGE_SIZE } from '../config';

const RunsContext = createContext();
const socket = io(WS_URL);
const OFFLINE_QUEUE_KEY = 'crc_offline_queue';

const gqlRequest = async (query, variables = {}) => {
    const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
    });
    if (!res.ok) throw new Error(`Network error: ${res.status}`);
    const result = await res.json();
    if (result.errors) throw new Error(result.errors[0]?.message || 'GraphQL error');
    return result.data;
};

const getOfflineQueue = () => JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
const setOfflineQueue = (queue) => localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));

export const RunsProvider = ({ children }) => {
    const [runs, setRuns] = useState([]);
    const [runners, setRunners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchRunners = useCallback(async () => {
        try {
            const data = await gqlRequest(`query { runners { id name level } }`);
            if (data) setRunners(data.runners);
        } catch {
            setIsOffline(true);
        }
    }, []);

    const fetchRuns = useCallback(async (page = 1, limit = DEFAULT_PAGE_SIZE, append = false) => {
        const query = `query GetRuns($page: Int, $limit: Int) { runs(page: $page, limit: $limit) { totalPages data { id runnerId name date distance type location } } }`;
        try {
            const data = await gqlRequest(query, { page, limit });
            const result = data.runs;
            setRuns(prev => append ? [...prev, ...result.data] : result.data);
            setHasMore(page < result.totalPages);
            setIsOffline(false);
        } catch {
            setIsOffline(true);
        } finally {
            setLoading(false);
        }
    }, []);

    const flushOfflineQueue = useCallback(async () => {
        const queue = getOfflineQueue();
        if (!queue.length) return;
        for (const item of queue) {
            if (item.kind === 'add') {
                await gqlRequest(`mutation Add($name: String!, $rId: Int!, $date: String!, $dist: String, $type: String!, $loc: String) { addRun(name: $name, runnerId: $rId, date: $date, distance: $dist, type: $type, location: $loc) { id } }`, item.payload);
            }
        }
        setOfflineQueue([]);
        fetchRuns(1, DEFAULT_PAGE_SIZE, false);
    }, [fetchRuns]);

    const addRun = async (newRun) => {
        const payload = { name: newRun.name, rId: newRun.runnerId, date: newRun.date, dist: newRun.distance, type: newRun.type, loc: newRun.location };
        try {
            await gqlRequest(`mutation Add($name: String!, $rId: Int!, $date: String!, $dist: String, $type: String!, $loc: String) { addRun(name: $name, runnerId: $rId, date: $date, distance: $dist, type: $type, location: $loc) { id } }`, payload);
            fetchRuns(1, DEFAULT_PAGE_SIZE, false);
        } catch {
            setIsOffline(true);
            const tempRun = { ...newRun, id: Date.now(), isPending: true };
            setRuns(prev => [tempRun, ...prev]);
            setOfflineQueue([...getOfflineQueue(), { kind: 'add', payload }]);
            toast.warning('Saved offline. Will sync when online.');
        }
    };

    const deleteRun = async (id) => {
        try {
            await gqlRequest(`mutation Del($id: ID!) { deleteRun(id: $id) }`, { id });
            fetchRuns(1, DEFAULT_PAGE_SIZE, false);
        } catch {
            setIsOffline(true);
            setRuns(prev => prev.filter(r => r.id !== id));
        }
    };

    const getRunById = async (id) => {
        const data = await gqlRequest(`query GetRun($id: ID!) { run(id: $id) { id name date distance type location runnerId } }`, { id });
        return data ? data.run : null;
    };

    useEffect(() => { fetchRuns(); fetchRunners(); }, [fetchRuns, fetchRunners]);
    useEffect(() => {
        socket.on('runAdded', (newRun) => {
            setRuns(prev => [newRun, ...prev]);
            toast.info(`🏃 New Run: ${newRun.name}!`, { position: 'bottom-right', theme: 'dark' });
        });
        return () => socket.off('runAdded');
    }, []);

    useEffect(() => {
        const onOnline = async () => {
            setIsOffline(false);
            await flushOfflineQueue();
        };
        window.addEventListener('online', onOnline);
        return () => window.removeEventListener('online', onOnline);
    }, [flushOfflineQueue]);

    return <RunsContext.Provider value={{ runs, runners, loading, isOffline, hasMore, fetchRuns, addRun, deleteRun, getRunById }}>{children}</RunsContext.Provider>;
};

export const useRuns = () => useContext(RunsContext);
