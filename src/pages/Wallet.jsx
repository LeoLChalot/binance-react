import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function Wallet() {
    const { user } = useAuth();
    const [cryptoPrices, setCryptoPrices] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCryptoPrices = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/simple/price?ids=${user.walletData.tokenData.map(token => token.id).join(',')}&vs_currencies=usd`,
                    {
                        headers: {
                            'x-cg-demo-api-key': import.meta.env.VITE_API_KEY
                        }
                    }
                );
                
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des prix');
                }
                
                const data = await response.json();
                setCryptoPrices(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (user.walletData.tokenData.length > 0) {
            fetchCryptoPrices();
        } else {
            setLoading(false);
        }
    }, [user.walletData.tokenData]);

    const calculateTotalValue = () => {
        let total = user.walletData.balance;
        
        user.walletData.tokenData.forEach(token => {
            if (cryptoPrices[token.id]) {
                total += token.quantity * cryptoPrices[token.id].usd;
            }
        });
        
        return total.toFixed(2);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <div className="ml-20 h-screen overflow-y-auto">
                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-8 text-left">Portefeuille</h1>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                            <h2 className="text-lg text-gray-400 mb-2">Solde disponible</h2>
                            <p className="text-2xl font-bold">${user.walletData.balance.toFixed(2)}</p>
                        </div>
                        
                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                            <h2 className="text-lg text-gray-400 mb-2">Valeur des cryptos</h2>
                            <p className="text-2xl font-bold">
                                ${loading ? (
                                    <span className="text-gray-500">Chargement...</span>
                                ) : (
                                    (calculateTotalValue() - user.walletData.balance).toFixed(2)
                                )}
                            </p>
                        </div>

                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                            <h2 className="text-lg text-gray-400 mb-2">Valeur totale</h2>
                            <p className="text-2xl font-bold text-green-500">
                                ${loading ? (
                                    <span className="text-gray-500">Chargement...</span>
                                ) : calculateTotalValue()}
                            </p>
                        </div>
                    </div>

                    <div className="bg-zinc-900 rounded-xl border border-zinc-800">
                        <div className="p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold">Mes cryptomonnaies</h2>
                        </div>
                        
                        {loading ? (
                            <div className="p-6 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                            </div>
                        ) : user.walletData.tokenData.length === 0 ? (
                            <div className="p-6 text-center text-gray-400">
                                Vous ne possédez pas encore de cryptomonnaies
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm text-gray-400">
                                            <th className="p-4">Crypto</th>
                                            <th className="p-4">Quantité</th>
                                            <th className="p-4">Prix actuel</th>
                                            <th className="p-4">Valeur totale</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {user.walletData.tokenData.map((token, index) => (
                                            <tr 
                                                key={token.id}
                                                className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <img 
                                                            src={token.image} 
                                                            alt={token.name} 
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                        <div>
                                                            <div className="font-medium">{token.name}</div>
                                                            <div className="text-sm text-gray-400">{token.symbol.toUpperCase()}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {token.quantity}
                                                </td>
                                                <td className="p-4">
                                                    {cryptoPrices[token.id] ? (
                                                        `$${cryptoPrices[token.id].usd.toFixed(2)}`
                                                    ) : (
                                                        <span className="text-gray-500">-</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {cryptoPrices[token.id] ? (
                                                        `$${(token.quantity * cryptoPrices[token.id].usd).toFixed(2)}`
                                                    ) : (
                                                        <span className="text-gray-500">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
