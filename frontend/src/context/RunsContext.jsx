/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';

const RunsContext = createContext();
const BASE_URL = 'https://localhost:7209/api';

export const RunsProvider = ({ children }) => {
    // BRONZE: Maintain session tracking across tab/browser lifecycles via persisted storage keys
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    const [runs, setRuns] = useState([]);
    const [runners, setRunners] = useState([]);
    const [activityTypes, setActivityTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);
    const [logs, setLogs] = useState([]);
    const [observationList, setObservationList] = useState([]);

    // Helper method to automatically provide token signatures for outgoing protected mutations
    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    // --- AUTH FUNCTIONS ---

    const login = async (email) => {
        try {
            const res = await fetch(`${BASE_URL}/Auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                const data = await res.json();

                // Persist session tokens and decoded info locally
                setToken(data.token);
                setCurrentUser(data.user);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                if (data.user.role === 'Admin') {
                    toast.success(`Access Granted. Welcome back, Admin!`);
                } else if (data.user.id === 0) {
                    toast.info(`Logged in as Guest: ${data.user.name}`);
                } else {
                    toast.success(`Welcome back, ${data.user.name}!`);
                }
                return true;
            } else {
                toast.error("Invalid email identity or configuration crash.");
                return false;
            }
        } catch {
            toast.error("Backend login request timed out.");
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setCurrentUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.info("Logged out.");
    };

    // --- FETCH FUNCTIONS ---

    const fetchRunners = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/Users`, { headers: getAuthHeaders() });
            if (res.ok) setRunners(await res.json());
        } catch { setIsOffline(true); }
    }, []);

    const fetchTypes = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/ActivityTypes`, { headers: getAuthHeaders() });
            if (res.ok) setActivityTypes(await res.json());
        } catch (err) { console.error("Failed to fetch types:", err); }
    }, []);

    const fetchRuns = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/RunActivities`, { headers: getAuthHeaders() });
            if (!res.ok) throw new Error();
            const rawData = await res.json();

            const mappedData = rawData.map(run => {
                const runner = runners.find(r => Number(r.id) === Number(run.userId));
                const typeObj = activityTypes.find(t => Number(t.id) === Number(run.activityTypeId));

                let displayName = "Guest Runner";
                if (Number(run.userId) === 0) {
                    displayName = "Guest";
                } else if (runner) {
                    displayName = runner.name;
                }

                return {
                    ...run,
                    runnerName: displayName,
                    type: typeObj ? (typeObj.typeName || typeObj.TypeName) : "No Type"
                };
            });

            setRuns(mappedData);
            setIsOffline(false);
        } catch (err) {
            setIsOffline(true);
        } finally {
            setLoading(false);
        }
    }, [runners, activityTypes]);

    const fetchLogs = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/ActionLogs`, { headers: getAuthHeaders() });
            if (res.ok) setLogs(await res.json());
        } catch (err) { console.error("Failed to fetch logs:", err); }
    }, []);

    const fetchObservationList = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/ObservationList`, { headers: getAuthHeaders() });
            if (res.ok) setObservationList(await res.json());
        } catch (err) { console.error("Failed to fetch observation list:", err); }
    }, []);

    // --- ACTION FUNCTIONS ---

    const addRun = async (newRun) => {
        try {
            const res = await fetch(`${BASE_URL}/RunActivities`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: newRun.name,
                    distance: parseFloat(newRun.distance),
                    date: newRun.date,
                    userId: parseInt(newRun.userId),
                    activityTypeId: parseInt(newRun.activityTypeId)
                })
            });
            if (res.ok) {
                fetchRuns();
                fetchLogs();
                fetchObservationList();
                toast.success("Run added!");
            }
        } catch { toast.error("Server connection failed"); }
    };

    const updateRun = async (id, updatedRun) => {
        try {
            const res = await fetch(`${BASE_URL}/RunActivities/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    id: parseInt(id),
                    name: updatedRun.name,
                    distance: parseFloat(updatedRun.distance),
                    date: updatedRun.date,
                    userId: parseInt(updatedRun.userId),
                    activityTypeId: parseInt(updatedRun.activityTypeId)
                })
            });
            if (res.ok) {
                fetchRuns();
                fetchLogs();
                fetchObservationList();
                toast.success("Update logged!");
            }
        } catch { toast.error("Update failed"); }
    };

    const deleteRun = async (id) => {
        try {
            await fetch(`${BASE_URL}/RunActivities/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            fetchRuns();
            fetchLogs();
            fetchObservationList();
            toast.info("Deletion logged!");
        } catch { setIsOffline(true); }
    };

    const getRunById = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/RunActivities/${id}`, { headers: getAuthHeaders() });
            return await res.json();
        } catch { return null; }
    };

    useEffect(() => {
        if (token) {
            fetchRunners();
            fetchTypes();
        }
    }, [token, fetchRunners, fetchTypes]);

    useEffect(() => {
        if (token && runners.length > 0) fetchRuns();
    }, [token, runners, activityTypes, fetchRuns]);

    return (
        <RunsContext.Provider value={{
            runs, runners, activityTypes, loading, isOffline, currentUser, token,
            login, logout, fetchRuns, addRun, updateRun, deleteRun, getRunById,
            logs, fetchLogs, observationList, fetchObservationList
        }}>
            {children}
        </RunsContext.Provider>
    );
};
export const useRuns = () => useContext(RunsContext);