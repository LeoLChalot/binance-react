import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from "react-router-dom";
import SingleCoin from './components/SingleCoin'
import './App.css'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Market from './pages/Market'
import Wallet from './pages/Wallet'
import Profile from './pages/Profile'

function PrivateRoute({ children }) {
  const { user, setShowAuth } = useAuth();

  if (!user) {
    setShowAuth(true);
    return <Navigate to="/" />;
  }

  return children;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="h-full w-full flex-1 bg-binance">
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/crypto/:cryptoId" 
        element={
            <CryptoDetailWrapper />
        } 
        />
        <Route
          path="/market"
          element={
            <PrivateRoute>
              <Market />
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <PrivateRoute>
              <Wallet />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

const CryptoDetailWrapper = () => {
  const { cryptoId } = useParams();
  return <SingleCoin cryptoId={cryptoId} />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="h-full w-full flex flex-col">
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
