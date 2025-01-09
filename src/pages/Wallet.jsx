import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function Wallet() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
        </div>
    );
}
