import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        balance: 0,
        history: [],
        profilePic: ''
    });
    const { login, register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isLogin && formData.password !== formData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        const success = isLogin 
            ? await login({ email: formData.email, password: formData.password })
            : await register({ email: formData.email, password: formData.password, balance: 0, history: [], profilePic: '' });
        
        if (success) {
            onClose();
        } else {
            alert(isLogin ? 'Invalid credentials' : 'Email already exists');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-lg p-8 w-full max-w-md relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    ✕
                </button>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isLogin ? 'Content de vous revoir' : 'Bienvenue parmi nous'}
                    </h2>
                    <p className="text-gray-400">
                        {isLogin ? 'Continuez votre investissement' : 'Commencez votre investissement'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mot de passe"
                            className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirmer mot de passe"
                                className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                                required
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                        {isLogin ? 'Se connecter' : 'S\'enregistrer'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-green-500 hover:text-green-400 transition-colors"
                    >
                        {isLogin ? "Pas encore de compte ?" : "Déja un compte ?"}
                    </button>
                </div>
            </div>
        </div>
    );
}
