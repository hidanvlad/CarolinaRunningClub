/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';

const RunsContext = createContext();
const BASE_URL = 'http://192.168.1.18:5048/api';

export const RunsProvider = ({ children }) => {
    // PERSISTENCY: Load user from localStorage on startup
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [runs, setRuns] = useState([]);
    const [runners, setRunners] = useState([]);
    const [activityTypes, setActivityTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);
    const [logs, setLogs] = useState([]);
    const [observationList, setObservationList] = useState([]);

    // --- AUTH FUNCTIONS ---

    const login = (email) => {
        // Logic: Match the email to the users in your DB
        const userMatch = runners.find(r => r.email.toLowerCase() === email.toLowerCase());

        if (userMatch) {
            // Determine role based on email as you suggested
            const role = userMatch.email === 'hidan.vlad@test.com' ? 'Admin' : 'User';
            const sessionUser = { ...userMatch, role };

            setCurrentUser(sessionUser);
            localStorage.setItem('user', JSON.stringify(sessionUser));
            toast.success(`Welcome back, ${sessionUser.name}!`);
            return true;
        } else {
            toast.error("User not found in database.");
            return false;
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
        toast.info("Logged out.");
    };

    // --- FETCH FUNCTIONS ---

    const fetchRunners = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/Users`);
            if (res.ok) setRunners(await res.json());
        } catch { setIsOffline(true); }
    }, []);

    const fetchTypes = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/ActivityTypes`);
            if (res.ok) setActivityTypes(await res.json());
        } catch (err) { console.error("Failed to fetch types:", err); }
    }, []);

    const fetchRuns = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/RunActivities`);
            if (!res.ok) throw new Error();
            const rawData = await res.json();

            const mappedData = rawData.map(run => {
                const runner = runners.find(r => Number(r.id) === Number(run.userId));
                const typeObj = activityTypes.find(t => Number(t.id) === Number(run.activityTypeId));

                return {
                    ...run,
                    runnerName: runner ? runner.name : "Unknown",
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
            const res = await fetch(`${BASE_URL}/ActionLogs`);
            if (res.ok) setLogs(await res.json());
        } catch (err) { console.error("Failed to fetch logs:", err); }
    }, []);

    const fetchObservationList = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/ObservationList`);
            if (res.ok) setObservationList(await res.json());
        } catch (err) { console.error("Failed to fetch observation list:", err); }
    }, []);

    // --- ACTION FUNCTIONS ---

    const addRun = async (newRun) => {
        try {
            const res = await fetch(`${BASE_URL}/RunActivities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Performed-By': currentUser?.id.toString() || "0"
                },
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
                headers: {
                    'Content-Type': 'application/json',
                    'X-Performed-By': currentUser?.id.toString() || "0"
                },
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
                headers: { 'X-Performed-By': currentUser?.id.toString() || "0" }
            });
            fetchRuns();
            fetchLogs();
            fetchObservationList();
            toast.info("Deletion logged!");
        } catch { setIsOffline(true); }
    };

    const getRunById = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/RunActivities/${id}`);
            return await res.json();
        } catch { return null; }
    };

    useEffect(() => {
        fetchRunners();
        fetchTypes();
    }, [fetchRunners, fetchTypes]);

    useEffect(() => {
        if (runners.length > 0) fetchRuns();
    }, [runners, activityTypes, fetchRuns]);

    return (
        <RunsContext.Provider value={{
            runs, runners, activityTypes, loading, isOffline, currentUser,
            login, logout, fetchRuns, addRun, updateRun, deleteRun, getRunById,
            logs, fetchLogs, observationList, fetchObservationList
        }}>
            {children}
        </RunsContext.Provider>
    );
};
export const useRuns = () => useContext(RunsContext);