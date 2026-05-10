import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { RunsProvider } from './context/RunsContext';

// Pages
import LandingPage from './pages/LandingPage/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import RunFormPage from './pages/Dashboard/RunFormPage';
import RunDetail from './pages/RunDetail/RunDetail';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import ChatPage from './pages/Chat/ChatPage';

// Components
import AppNavbar from './components/Navigation/AppNavbar';
import AnimatedPage from './components/Transitions/AnimatedPage';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
                <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
                <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />

                {/* Dashboard & Run Management */}
                <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
                <Route path="/add-run" element={<AnimatedPage><RunFormPage /></AnimatedPage>} />
                <Route path="/edit-run/:id" element={<AnimatedPage><RunFormPage /></AnimatedPage>} />
                <Route path="/run/:id" element={<AnimatedPage><RunDetail /></AnimatedPage>} />

                {/* Global Chat Page */}
                <Route path="/chat" element={<AnimatedPage><ChatPage /></AnimatedPage>} />

                {/* Admin-Only Panel */}
                <Route path="/admin-panel" element={<AnimatedPage><AdminPanel /></AnimatedPage>} />
            </Routes>
        </AnimatePresence>
    );
};

// Helper component to handle conditional Navbar rendering
const AppLayout = () => {
    const location = useLocation();

    // Define paths where the AppNavbar should NOT appear
    const publicPaths = ['/', '/login', '/register'];
    const showAppNavbar = !publicPaths.includes(location.pathname);

    return (
        <>
            {/* The AppNavbar only renders on Dashboard, Chat, Admin, etc. */}
            {showAppNavbar && <AppNavbar />}
            <AnimatedRoutes />
        </>
    );
};

function App() {
    return (
        <RunsProvider>
            <Router>
                <AppLayout />
            </Router>
        </RunsProvider>
    );
}

export default App;