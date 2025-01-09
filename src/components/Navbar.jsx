import React from 'react';

export default function Navbar({ setIsModalOpen }) {
    return (
        <nav className="border-b border-zinc-800 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="text-white text-xl font-bold">
                        CrypTOP
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                        Me connecter
                    </button>
                </div>
            </div>
        </nav>
    );
}