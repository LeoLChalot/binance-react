import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ setIsModalOpen, navbarConnected = false }) {
    const { logout } = useAuth();

    const navButtonStyle = "relative py-1 text-white/70 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-green-500 after:transition-transform after:duration-200 hover:after:scale-x-100";

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
                            <button className={navButtonStyle}>Accueil</button>
                            <button className={navButtonStyle}>Marché</button>
                            <button className={navButtonStyle}>Portefeuille</button>
                            <button className={navButtonStyle}>Profil</button>
                            <button className={navButtonStyle}>Paramètres</button>
                        </div>
    
                        <button
                            onClick={logout}
                            className="border border-white text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </nav>
        );
    }
}