import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white">
            useContext test <br />
            <button onClick={logout}>Déco</button>
            <p>{user.email}</p>
            <p>{user.balance}</p>
            <p>{user.history}</p>
        </div>
    );
}
