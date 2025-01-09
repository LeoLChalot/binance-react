import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white">
            TEST
            <button onClick={logout}>Déco</button>
        </div>
    );
}
