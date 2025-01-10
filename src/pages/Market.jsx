import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCrypto } from '../contexts/CryptoContext';
import Navbar from '../components/Navbar';
import CryptoRow from '../components/Crypto/CryptoRow';
import CryptoList from '../components/Crypto/CryptoList';

export default function Market() {
    const { user } = useAuth();
    const { cryptos, loading, error, lastUpdate } = useCrypto();
    const navigate = useNavigate();

    const handleCryptoClick = (crypto) => {
        navigate(`/market/${crypto.id}`);
    };

    return (

        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <div className="ml-20 h-screen overflow-y-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Marché</h1>
                        {lastUpdate && (
                            <p className="text-sm text-gray-400">
                                Dernière mise à jour : {new Date(lastUpdate).toLocaleTimeString()}
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    ) : (
                        <CryptoList cryptos={cryptos} onCryptoClick={handleCryptoClick} />
                    )}
                </div>
            </div>
        </div>

    );
}
