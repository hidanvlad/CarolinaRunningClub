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
import AnimatedPage from './components/Transitions/AnimatedPage';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
                <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
                <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
                <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
                <Route path="/add-run" element={<AnimatedPage><RunFormPage /></AnimatedPage>} />
                {/* GOLD: Added Dynamic ID Routes */}
                <Route path="/edit-run/:id" element={<AnimatedPage><RunFormPage /></AnimatedPage>} />
                <Route path="/run/:id" element={<AnimatedPage><RunDetail /></AnimatedPage>} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    return (
        <RunsProvider>
            <Router>
                <AnimatedRoutes />
            </Router>
        </RunsProvider>
    );
}

export default App;