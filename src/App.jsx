import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registration from './pages/Registration';
import AdminDash from './pages/AdminDash';
import StudentDash from './pages/StudentDash';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/admin-dash" element={<AdminDash />} />
        <Route path="/student-dash" element={<StudentDash />} />
      </Routes>
    </Router>
  );
}

export default App;