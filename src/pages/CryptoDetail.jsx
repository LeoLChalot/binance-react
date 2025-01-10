import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SingleCoin from '../components/SingleCoin';

export default function CryptoDetail() {
    const { cryptoId } = useParams();

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <div className="ml-20 h-screen overflow-y-auto">
                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-8 text-left">Détail de {cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1)}</h1>
                    <SingleCoin cryptoId={cryptoId} />
                </div>
            </div>
        </div>
    );
}
