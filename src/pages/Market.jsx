import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCrypto } from '../contexts/CryptoContext';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import CryptoRow from '../components/Crypto/CryptoRow';
import CryptoList from '../components/Crypto/CryptoList';

export default function Market() {
    const { user } = useAuth();
    const { cryptos, loading, error, lastUpdate } = useCrypto();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleCryptoClick = (crypto) => {
        navigate(`/market/${crypto.id}`);
    };

    const filteredCryptos = cryptos.filter(crypto => 
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (

        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <div className="ml-20 h-screen overflow-y-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Marché</h1>
                        <div className="flex items-center gap-8">
                            {lastUpdate && (
                                <p className="text-sm text-gray-400">
                                    Dernière mise à jour : {new Date(lastUpdate).toLocaleTimeString()}
                                </p>
                            )}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-zinc-800 rounded-lg bg-zinc-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Rechercher une crypto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
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
                        <>
                            {filteredCryptos.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    Aucune crypto ne correspond à votre recherche
                                </div>
                            ) : (
                                <CryptoList cryptos={filteredCryptos} onCryptoClick={handleCryptoClick} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>

    );
}
