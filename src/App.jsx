import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Dashboard from './components/Dashboard';
import RunDetail from './components/RunDetail'; // New Import

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Dynamic route to show one specific run */}
                <Route path="/run/:id" element={<RunDetail />} />
            </Routes>
        </Router>
    );
}

export default App;