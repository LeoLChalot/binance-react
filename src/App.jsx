import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from "react-router-dom";
import SingleCoin from './components/SingleCoin'
import './App.css'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import { CryptoProvider } from './contexts/CryptoContext';
import Landing from './pages/Landing'
import Market from './pages/Market'
import Wallet from './pages/Wallet'
import Profile from './pages/Profile'
import Transactions from './pages/Transactions'
import CryptoDetail from './pages/CryptoDetail'

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
        <Route path="/" element={user ? <Navigate to="/market" /> : <Landing />} />
        <Route
          path="/market"
          element={
            <PrivateRoute>
              <Market />
            </PrivateRoute>
          }
        />
        <Route
          path="/market/:cryptoId"
          element={
            <PrivateRoute>
              <CryptoDetail />
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
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CryptoProvider>
          <div className="h-full w-full flex flex-col">
            <AppContent />
          </div>
        </CryptoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
