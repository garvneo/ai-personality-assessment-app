import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import CandidateView from './pages/CandidateView';
import RecruiterView from './pages/RecruiterView';

function App() {
    const [token, setToken] = useState('');
    const [role, setRole] = useState('');

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
                {role === 'candidate' && <Route path="/candidate" element={<CandidateView token={token} />} />}
                {role === 'recruiter' && <Route path="/recruiter" element={<RecruiterView token={token} />} />}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
