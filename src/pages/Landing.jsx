import React, { useState } from 'react';
import AuthModal from '../components/AuthModal';
import Navbar from '../components/Navbar';
import { MoveUpRight, Star, Wallet, LineChart, MessageCircle, History, Shield, Globe2 } from 'lucide-react';

export default function Landing() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const features = [
        {
            icon: <Wallet className="w-6 h-6" />,
            title: "Portefeuille Sécurisé",
            description: "Gérez tous vos actifs numériques en un seul endroit avec une sécurité maximale."
        },
        {
            icon: <LineChart className="w-6 h-6" />,
            title: "Trading Simplifié",
            description: "Achetez et vendez des cryptomonnaies en quelques clics avec une interface intuitive."
        },
        {
            icon: <MessageCircle className="w-6 h-6" />,
            title: "Communauté Active",
            description: "Échangez avec d'autres investisseurs et partagez vos analyses sur notre blog."
        },
        {
            icon: <History className="w-6 h-6" />,
            title: "Historique Détaillé",
            description: "Suivez toutes vos transactions et analysez vos performances."
        }
    ];

    const advantages = [
        {
            icon: <Shield className="w-8 h-8 text-green-500" />,
            title: "Sécurité Maximale",
            description: "Protection de vos actifs avec les meilleurs standards de sécurité."
        },
        {
            icon: <Globe2 className="w-8 h-8 text-blue-500" />,
            title: "Disponible 24/7",
            description: "Accédez à votre portefeuille et tradez n'importe où, n'importe quand."
        }
    ];

    return (
        <div className="h-screen w-full relative overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="fixed inset-0 w-full h-full object-cover"
                style={{ zIndex: 0 }}
            >
                <source src="/videos/crypto-bg.mp4" type="video/mp4" />
            </video>

            <div className="relative w-full min-h-screen">
                <Navbar setIsModalOpen={setIsModalOpen} className="z-1 bg-black fixed top-0 w-full" />

                <main className="w-full bg-black/70 backdrop-blur-sm pt-16">
                    {/* Hero Section */}
                    <div className="relative">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 text-left">
                                La crypto pour tous
                            </h1>
                            <p className="text-xl font-extralight text-white mb-32 max-w-2xl text-left">
                                CrypTOP, c'est la plateforme tout-en-un pour gérer votre portefeuille facilement, en toute securité et en toute confiance.
                            </p>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-green-500 text-white px-4 py-4 rounded hover:bg-green-600 transition-colors flex items-center justify-between gap-x-16 w-72"
                                >
                                    <p className="font-light text-xl">Découvrir</p>
                                    <MoveUpRight size={24}/>
                                </button>
                                <div className='w-72 border-white border py-4 px-4 text-white rounded flex items-center justify-between'>
                                    <p className="font-light text-lg">4.7 / 5 sur Trustpilot</p>
                                    <Star size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="backdrop-blur-sm bg-black/40">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                            <h2 className="text-3xl font-bold text-white mb-12 text-center">
                                Tout ce dont vous avez besoin
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {features.map((feature, index) => (
                                    <div key={index} className="bg-zinc-800 p-6 rounded-xl hover:bg-zinc-700 transition-colors">
                                        <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                            <div className="text-green-500">
                                                {feature.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                        <p className="text-gray-400">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Advantages Section */}
                    <div className="backdrop-blur-sm bg-zinc-900 py-24 ">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {advantages.map((advantage, index) => (
                                <div key={index} className="flex items-start justify-center gap-6">
                                    <div className="bg-zinc-900 p-4 rounded-xl">
                                        {advantage.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{advantage.title}</h3>
                                        <p className="text-gray-400">{advantage.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                <AuthModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                />
            </div>
        </div>
    );
}