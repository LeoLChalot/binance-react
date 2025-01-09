import React, { useState } from 'react';
import AuthModal from '../components/AuthModal';

export default function Landing() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="h-full w-full bg-black">
            <nav className="border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="text-white text-xl font-bold">
                            CrypTOP
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Me connecter
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
                        Votre compagnion de trading en ligne
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Accédez aux marchés mondiaux, effectuez des transactions sur les cryptomonnaies, les actions et plus encore avec notre plateforme de trading puissante.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-600 transition-colors"
                    >
                        Commencer
                    </button>
                </div>
            </main>

            <AuthModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
}