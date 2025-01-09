import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <button onClick={logout}>Déco</button>
            <p>{user.email}</p>
            <p>{user.balance}</p>
            <p>{user.history}</p>
        </div>
    );
}
