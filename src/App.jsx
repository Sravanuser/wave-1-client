import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast'; // ✅ Add this
import './App.css';

import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Studies from './pages/study/Studies';
import CreateStudies from './pages/study/CreateStudies';
import Header from './components/Header';
import SitesPage from './pages/site/Sites';
import Subjects from './pages/subject/Subjects';
import Forms from './pages/visit/FormDetails';
import { useAuth } from './context/AuthContext';

function AppRoutes() {
  const { isAuthenticated,loading } = useAuth();
  if (loading) return null;
  return (
    <Routes>
      {/* Login and Register */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/studies" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/studies" /> : <Register />}
      />

      {/* Authenticated Routes */}
      <Route
        path="/studies"
        element={isAuthenticated ? <><Header /><Studies /></> : <Navigate to="/" />}
      />
      <Route
        path="/studies/create"
        element={isAuthenticated ? <><Header /><CreateStudies /></> : <Navigate to="/" />}
      />
      <Route
        path="/sites/:studyId"
        element={isAuthenticated ? <><Header /><SitesPage /></> : <Navigate to="/" />}
      />
      <Route
        path="/subjects/:sitesId"
        element={isAuthenticated ? <><Header /><Subjects /></> : <Navigate to="/" />}
      />
      <Route
        path="/forms/:subjectId"
        element={isAuthenticated ? <><Header /><Forms /></> : <Navigate to="/" />}
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/studies" : "/"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Toaster position="top-right" /> {/* ✅ Add Toaster here */}
          <AppRoutes />
        </Box>
      </Box>
    </Router>
  );
}
