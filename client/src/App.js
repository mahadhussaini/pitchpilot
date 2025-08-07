import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import DeckBuilder from './pages/DeckBuilder/DeckBuilder';
import Analytics from './pages/Analytics/Analytics';
import Investors from './pages/Investors/Investors';
import Templates from './pages/Templates/Templates';
import Settings from './pages/Settings/Settings';
import LoadingSpinner from './components/UI/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          user ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/deck-builder" element={
          user ? <Layout><DeckBuilder /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/deck-builder/:id" element={
          user ? <Layout><DeckBuilder /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/analytics" element={
          user ? <Layout><Analytics /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/investors" element={
          user ? <Layout><Investors /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/templates" element={
          user ? <Layout><Templates /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/settings" element={
          user ? <Layout><Settings /></Layout> : <Navigate to="/login" />
        } />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App; 