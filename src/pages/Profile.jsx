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
                updateUser({ accountData: { ...user.accountData, profilePic: reader.result } });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <div className="ml-20 p-8">
                <h1 className="text-3xl font-bold mb-6 text-left">Profil</h1>
                <div className="border-t border-zinc-700 space-y-6">
                    <div className="flex items-center gap-x-6 mt-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-700">
                                <img 
                                    src={user.accountData.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.accountData.email}
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
                            <h2 className="text-xl font-bold">{user.accountData.email}</h2>
                            <p className="text-white/70">
                                Membre depuis le {new Date(user.accountData.createdAt).toLocaleString('fr-FR', { 
                                    year: 'numeric', 
                                    month: '2-digit', 
                                    day: '2-digit' 
                                }).replace(/\//g, '/')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
