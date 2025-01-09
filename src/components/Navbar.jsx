import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ setIsModalOpen, navbarConnected = false }) {
    const { logout } = useAuth();
    const location = useLocation();

    const navButtonStyle = "relative py-1 text-white/70 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-white/40 after:transition-transform after:duration-200 hover:after:scale-x-100";
    const activeStyle = "text-white after:scale-x-100";

    const isActive = (path) => {
        return location.pathname === path;
    };

    if (navbarConnected === false) {
        return (
            <nav className="border-b border-zinc-800 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="text-white text-xl font-bold">
                            CrypTOP
                        </div>
    
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="border border-white text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Connexion
                        </button>
                    </div>
                </div>
            </nav>
        );
    } else {
        return (
            <nav className="border-b border-zinc-800 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex gap-x-8">
                            <p className="text-white text-xl font-bold">CrypTOP</p>
                            <Link to="/dashboard" className={`${navButtonStyle} ${isActive('/dashboard') ? activeStyle : ''}`}>Accueil</Link>
                            <Link to="/market" className={`${navButtonStyle} ${isActive('/market') ? activeStyle : ''}`}>Marché</Link>
                            <Link to="/wallet" className={`${navButtonStyle} ${isActive('/wallet') ? activeStyle : ''}`}>Portefeuille</Link>
                            <Link to="/profile" className={`${navButtonStyle} ${isActive('/profile') ? activeStyle : ''}`}>Profil</Link>
                            <Link to="/settings" className={`${navButtonStyle} ${isActive('/settings') ? activeStyle : ''}`}>Paramètres</Link>
                        </div>
    
                        <button
                            onClick={logout}
                            className="border border-white text-white px-4 py-2 rounded-lg hover:bg-red-900/50 transition-colors"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </nav>
        );
    }
}