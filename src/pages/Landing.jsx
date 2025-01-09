import React, { useState } from 'react';
import AuthModal from '../components/AuthModal';
import Navbar from '../components/Navbar';
import { MoveUpRight, Star } from 'lucide-react';

export default function Landing() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="h-full w-full flex flex-col bg-black">

            <Navbar setIsModalOpen={setIsModalOpen} />

            <main className="flex-1 w-full">
                <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-left">
                        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
                            La crypto pour tous
                        </h1>
                        <p className="text-xl font-extralight text-white mb-32">
                            CrypTOP, c'est la plateforme tout-en-un pour gérer votre portefeuille facilement, en toute securité et en toute confiance.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-green-500 text-white px-4 py-4 rounded hover:bg-green-600 transition-colors flex items-center justify-between gap-x-16 w-1/4"
                        >
                            <p className="font-light text-xl">Découvrir</p>
                            <MoveUpRight size={24}/>
                        </button>
                        <div className=' border-white border py-4 px-4 w-fit text-white rounded flex items-center gap-x-2 w-1/4 justify-between mt-2'>
                            <p className="font-light text-lg">4.7 / 5 sur Trustpilot</p>
                            <Star size={20} />
                        </div>
                    </div>
                </div>
            </main>

            <AuthModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
}