import React, { useEffect, useRef } from 'react'; // Added useEffect and useRef for tracking idle state
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { AnimatePresence } from 'framer-motion';
import { RunsProvider, useRuns } from './context/RunsContext'; // Imported useRuns hook to track current user context

// Pages
import LandingPage from './pages/LandingPage/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import RunFormPage from './pages/Dashboard/RunFormPage';
import RunDetail from './pages/RunDetail/RunDetail';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import ChatPage from './pages/Chat/ChatPage';
import Shop from './pages/Shop/Shop';
import EventsPage from './pages/Public/EventsPage';
import JoinPage from './pages/Public/JoinPage';
import TrainingPlansPage from './pages/Public/TrainingPlansPage';
import CoachesPage from './pages/Public/CoachesPage';
import ResultsPhotosPage from './pages/Public/ResultsPhotosPage';
import FaqContactPage from './pages/Public/FaqContactPage';

// Components
import AppNavbar from './components/Navigation/AppNavbar';
import AnimatedPage from './components/Transitions/AnimatedPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
                <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
                <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/events" element={<AnimatedPage><EventsPage /></AnimatedPage>} />
                <Route path="/join" element={<AnimatedPage><JoinPage /></AnimatedPage>} />
                <Route path="/training-plans" element={<AnimatedPage><TrainingPlansPage /></AnimatedPage>} />
                <Route path="/coaches" element={<AnimatedPage><CoachesPage /></AnimatedPage>} />
                <Route path="/results-photos" element={<AnimatedPage><ResultsPhotosPage /></AnimatedPage>} />
                <Route path="/faq-contact" element={<AnimatedPage><FaqContactPage /></AnimatedPage>} />

                <Route element={<ProtectedRoute />}>
                    {/* Dashboard & Run Management */}
                    <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
                    <Route path="/add-run" element={<AnimatedPage><RunFormPage /></AnimatedPage>} />
                    <Route path="/edit-run/:id" element={<AnimatedPage><RunFormPage /></AnimatedPage>} />
                    <Route path="/run/:id" element={<AnimatedPage><RunDetail /></AnimatedPage>} />

                    {/* Global Chat Page */}
                    <Route path="/chat" element={<AnimatedPage><ChatPage /></AnimatedPage>} />
                </Route>

                <Route element={<AdminRoute />}>
                    {/* Admin-Only Panel */}
                    <Route path="/admin-panel" element={<AnimatedPage><AdminPanel /></AnimatedPage>} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
};

// Helper component to handle conditional Navbar rendering and secure automatic logout
const AppLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useRuns(); // Grab active session context parameters

    // Reference pointer managing the background timeout state loop
    const inactivityTimer = useRef(null);

    // BRONZE REQUIREMENT: Set inactivity threshold limit (5 minutes)
    const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

    const handleAutomaticLogout = () => {
        console.warn("[BRONZE SESSION] Inactivity timeout reached. Evicting session claims.");

        // 1. Clear cryptographic token authentication stores
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // 2. Trigger global application context state cleanup if available
        if (logout) logout();

        // 3. Inform the user and force them back to the login screen
        // Avoid blocking alerts and keep UX consistent with in-app messaging
        console.info("Your session expired. Please login again.");
        navigate('/login');
    };

    const resetInactivityTimer = () => {
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current);
        }
        // Re-establish a clean execution timer tracking loop
        inactivityTimer.current = setTimeout(handleAutomaticLogout, INACTIVITY_TIMEOUT);
    };

    useEffect(() => {
        // Only run inactivity monitoring if a valid user session is currently logged in
        const publicPaths = ['/', '/login', '/register'];
        if (!currentUser || publicPaths.includes(location.pathname)) return;

        // Register global DOM event listeners to capture human interaction metrics
        const trackedEvents = ['mousemove', 'mousedown', 'click', 'keypress', 'scroll', 'touchstart'];

        // Initialize baseline timer tracking instantiations
        resetInactivityTimer();

        trackedEvents.forEach(evt => {
            window.addEventListener(evt, resetInactivityTimer);
        });

        // Clean up listeners on unmounting lifecycle hooks or route transitions
        return () => {
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
            trackedEvents.forEach(evt => {
                window.removeEventListener(evt, resetInactivityTimer);
            });
        };
    }, [currentUser, location.pathname]);

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