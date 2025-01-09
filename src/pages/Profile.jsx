import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function Profile() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
        </div>
    );
}
