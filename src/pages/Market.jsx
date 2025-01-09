import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function Market() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <div className="ml-20 p-8">
                <h1 className="text-3xl font-bold mb-6 text-left">Marché</h1>
            </div>
        </div>
    );
}