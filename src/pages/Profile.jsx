import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef();

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUser({ profilePic: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <div className="ml-20 p-8">
                <h1 className="text-3xl font-bold mb-6 text-left">Profil</h1>
                <div className="border border-zinc-700 rounded-lg p-6 space-y-6">
                    <div className="flex items-center gap-x-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-700">
                                <img 
                                    src={user.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.email}
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button 
                                onClick={() => fileInputRef.current.click()}
                                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                            >
                                <span className="text-sm">Changer</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <div className='text-left'>
                            <h2 className="text-xl font-bold">{user.email}</h2>
                            <p className="text-white/70">Membre depuis le {new Date(user.createdAt).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')} </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-zinc-800 rounded-lg p-4">
                            <p className="text-white/70 mb-1">Solde total</p>
                            <p className="text-2xl font-bold">{user.balance} €</p>
                        </div>
                        <div className="bg-zinc-800 rounded-lg p-4">
                            <p className="text-white/70 mb-1">Nombre de transactions</p>
                            <p className="text-2xl font-bold">{user.history ? user.history.length : 0}</p>
                        </div>
                    </div>

                    {user.history && user.history.length > 0 ? (
                        <div className="bg-zinc-800 rounded-lg p-4">
                            <h2 className="text-xl font-bold mb-4">Historique des transactions</h2>
                            <div className="space-y-4">
                                {user.history.map((transaction, index) => (
                                    <div key={index} className="flex justify-between items-center border-b border-zinc-700 pb-4">
                                        <div>
                                            <p className="font-medium">{transaction.type}</p>
                                            <p className="text-white/70 text-sm">{transaction.date}</p>
                                        </div>
                                        <p className={transaction.type === 'Dépôt' ? 'text-green-500' : 'text-red-500'}>
                                            {transaction.type === 'Dépôt' ? '+' : '-'}{transaction.amount} €
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-white/70">Aucune transaction pour le moment</p>
                    )}
                </div>
            </div>
        </div>
    );
}
