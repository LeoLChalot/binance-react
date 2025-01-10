import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCrypto } from '../contexts/CryptoContext';
import Navbar from '../components/Navbar';

export default function Wallet() {
    const { user, updateUser } = useAuth();
    const { cryptos, loading, error } = useCrypto();
    const [amount, setAmount] = useState('');
    const [fundingError, setFundingError] = useState('');
    const [fundingSuccess, setFundingSuccess] = useState('');

    const calculateTotalValue = () => {
        let total = user.walletData.balance; 
        
        user.walletData.tokenData.forEach(token => {
            const cryptoData = cryptos.find(c => c.id === token.id);
            if (cryptoData) {
                total += token.quantity * cryptoData.current_price;
            }
        });
        
        return total.toFixed(2);
    };

    const handleFunding = (e) => {
        e.preventDefault();
        setFundingError('');
        setFundingSuccess('');

        const fundAmount = parseFloat(amount);
        if (isNaN(fundAmount) || fundAmount <= 0) {
            setFundingError('Veuillez entrer un montant valide');
            return;
        }

        const updatedBalance = user.walletData.balance + fundAmount;
        updateUser({ walletData: { ...user.walletData, balance: updatedBalance } });
        setAmount('');
        setFundingSuccess('Votre wallet a été approvisionné avec succès !');
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
                            <p className="text-2xl font-bold mb-4">${user.walletData.balance.toFixed(2)}</p>
                            
                            <form onSubmit={handleFunding} className="mt-4 space-y-3">
                                {fundingError && (
                                    <div className="p-2 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-sm">
                                        {fundingError}
                                    </div>
                                )}
                                {fundingSuccess && (
                                    <div className="p-2 bg-green-500/10 border border-green-500 text-green-500 rounded-lg text-sm">
                                        {fundingSuccess}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        id="amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                        placeholder="Montant ($)"
                                        step="0.01"
                                        min="0"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                                    >
                                        +
                                    </button>
                                </div>
                            </form>
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
                                        {user.walletData.tokenData.map((token) => {
                                            const cryptoData = cryptos.find(c => c.id === token.id);
                                            return (
                                                <tr 
                                                    key={token.id}
                                                    className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <img 
                                                                src={cryptoData?.image} 
                                                                alt={cryptoData?.name} 
                                                                className="w-8 h-8 rounded-full"
                                                            />
                                                            <div>
                                                                <div className="font-medium">{cryptoData?.name}</div>
                                                                <div className="text-sm text-gray-400">
                                                                    {cryptoData?.symbol.toUpperCase()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        {token.quantity}
                                                    </td>
                                                    <td className="p-4">
                                                        {cryptoData ? (
                                                            `$${cryptoData.current_price.toFixed(2)}`
                                                        ) : (
                                                            <span className="text-gray-500">-</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        {cryptoData ? (
                                                            `$${(token.quantity * cryptoData.current_price).toFixed(2)}`
                                                        ) : (
                                                            <span className="text-gray-500">-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
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
