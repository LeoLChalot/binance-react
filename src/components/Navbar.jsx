import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, BarChart2, Wallet, User, LogOut, ArrowDownUp, Search } from 'lucide-react';
import Logo from '../assets/cryptop.png';

export default function Navbar({ setIsModalOpen, navbarConnected = false }) {
    const { logout, user } = useAuth();
    const location = useLocation();

    if (navbarConnected) {
        const menuItems = [
            { icon: BarChart2, path: '/market', label: 'Marché' },
            { icon: Search, label: 'Rechercher' },
            { icon: Wallet, path: '/wallet', label: 'Portefeuille' },
            { icon: ArrowDownUp, path: '/transactions', label: 'Transactions' },
            { icon: User, path: '/profile', label: 'Profil' }
        ];

        return (
            <nav className="fixed left-0 top-0 h-screen w-20 border-r border-zinc-800 flex flex-col items-center py-6">
                <div className="text-white text-xl font-bold flex items-center">
                    <img src={Logo} alt="CrypTOP" className="h-10 w-10 inline-block" />
                </div>
                <div className="flex-1 flex flex-col items-center space-y-6 mt-8">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`p-3 rounded-xl transition-all duration-200 group relative ${
                                    isActive 
                                    ? 'bg-zinc-800 text-white' 
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                }`}
                            >
                                <Icon size={24} />
                                <span className="absolute left-16 ml-4 bottom-2 px-2 py-1 bg-zinc-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <button 
                    onClick={logout}
                    className="p-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all duration-200 group relative"
                >
                    <LogOut size={24} />
                    <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                        Déconnexion
                    </span>
                </button>
            </nav>
        );
    } else {
        return (
            <nav className="border-b border-zinc-800 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="text-white text-xl font-bold flex items-center gap-x-2">
                            <img src={Logo} alt="CrypTOP" className="h-5 w-5 inline-block" />
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
    }
}