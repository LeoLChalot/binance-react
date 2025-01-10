import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const success = await login(formData);
            if (success) {
                onClose();
            } else {
                setError('Email ou mot de passe incorrect');
            }
        } else {
            if (currentStep === 1) {
                if (!formData.email || !formData.password || !formData.confirmPassword) {
                    setError('Veuillez remplir tous les champs');
                    return;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError('Les mots de passe ne correspondent pas');
                    return;
                }
                setCurrentStep(2);
            } else {
                if (!formData.firstName || !formData.lastName) {
                    setError('Veuillez remplir tous les champs');
                    return;
                }
                const success = await register(formData);
                if (success) {
                    onClose();
                } else {
                    setError('Cette adresse email est déjà utilisée');
                }
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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

                {!isLogin && (
                    <div className="flex justify-between mb-6 relative">
                        <div className="w-full">
                            <div className="flex justify-start">
                                <div className={`h-0.5 w-full ${currentStep == 1 ? 'bg-green-500' : 'bg-gray-600'}`} />
                                <div className={`h-0.5 w-full ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-600'}`} />
                            </div>
                            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-600 -z-10">
                                <div 
                                    className="h-full bg-green-500 transition-all duration-300"
                                    style={{ width: currentStep === 1 ? '0%' : '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isLogin || currentStep === 1 ? (
                        <>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                        onChange={handleInputChange}
                                        placeholder="Confirmer le mot de passe"
                                        className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                                        required
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="Prénom"
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Nom"
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                        {isLogin ? 'Se connecter' : (currentStep === 1 ? 'Suivant' : 'S\'inscrire')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setCurrentStep(1);
                            setError('');
                            setFormData({
                                email: '',
                                password: '',
                                confirmPassword: '',
                                firstName: '',
                                lastName: ''
                            });
                        }}
                        className="text-green-500 hover:text-green-400 transition-colors"
                    >
                        {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                    </button>
                </div>
            </div>
        </div>
    );
}
