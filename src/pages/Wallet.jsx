import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCrypto } from '../contexts/CryptoContext';
import Navbar from '../components/Navbar';
import FundingModal from '../components/Modal/FundingModal';
import { Plus, Euro, Banknote, EqualApproximately } from 'lucide-react';

export default function Wallet() {
    const { user } = useAuth();
    const { cryptos } = useCrypto();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!user?.walletData) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar navbarConnected />
                <div className="ml-20 h-screen overflow-y-auto">
                    <div className="p-8">
                        <div className="flex flex-col justify-center items-start">
                            <h1 className="text-3xl font-bold text-left">Mon Portefeuille</h1>
                        </div>
                        <div className="mt-8 text-center py-12 text-gray-400 bg-zinc-900/50 rounded-xl">
                            <p>Chargement du portefeuille...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const calculateCryptoValue = () => {
        if (!user.walletData.tokenData || !cryptos) return 0;
        return user.walletData.tokenData.reduce((acc, token) => {
            const cryptoData = cryptos.find(c => c.id === token.id);
            if (!cryptoData) return acc;
            return acc + ((token.quantity || 0) * cryptoData.current_price);
        }, 0);
    };

    const calculateTotalValue = () => {
        return (user.walletData.balance || 0) + calculateCryptoValue();
    };

    const calculateInitialInvestment = () => {
        if (!user.walletData.tokenData) return 0;
        return user.walletData.tokenData.reduce((acc, token) => {
            return acc + ((token.quantity || 0) * (token.purchasePrice || 0));
        }, 0);
    };

    const calculateTotalProfitLoss = () => {
        const currentValue = calculateCryptoValue();
        const investment = calculateInitialInvestment();
        return currentValue - investment;
    };

    const calculateTotalProfitLossPercentage = () => {
        const investment = calculateInitialInvestment();
        if (investment === 0) return 0;
        return (calculateTotalProfitLoss() / investment) * 100;
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <div className="ml-20 h-screen overflow-y-auto">
                <div className="p-8">
                    <div className="flex flex-col justify-center items-start">
                        <h1 className="text-3xl font-bold text-left">Mon Portefeuille</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800/50 hover:border-zinc-700/50 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500/10 p-2 rounded-lg">
                                        <Euro className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-300">Solde</h2>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 border border-gray-500 hover:border-gray-400 text-gray-400 hover:text-gray-300 font-medium py-2 px-2 rounded-lg transition-colors text-sm"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <p className="text-3xl font-bold">{(user.walletData.balance || 0).toFixed(2)} $</p>
                            <p className="text-sm text-gray-400 mt-1">Votre argent déposé</p>
                        </div>

                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800/50 hover:border-zinc-700/50 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-purple-500/10 p-2 rounded-lg">
                                    <Banknote className="w-5 h-5 text-purple-500" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-300">Valeur des cryptos</h2>
                            </div>
                            <p className="text-3xl font-bold">{calculateCryptoValue().toFixed(2)} $</p>
                            <p className="text-sm text-gray-400 mt-1">En temps réel</p>
                        </div>

                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800/50 hover:border-zinc-700/50 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-emerald-500/10 p-2 rounded-lg">
                                    <Euro className="w-5 h-5 text-emerald-500" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-300">Valeur totale</h2>
                            </div>
                            <p className="text-3xl font-bold">{calculateTotalValue().toFixed(2)} $</p>
                            <p className="text-sm text-gray-400 mt-1">Solde + Valeur des cryptos</p>
                        </div>

                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800/50 hover:border-zinc-700/50 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`${calculateTotalProfitLoss() >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'} p-2 rounded-lg`}>
                                    <EqualApproximately className={`w-5 h-5 ${calculateTotalProfitLoss() >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-300">Performance</h2>
                            </div>
                            <div className="space-y-1">
                                <p className={`text-3xl font-bold ${calculateTotalProfitLossPercentage() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {calculateTotalProfitLossPercentage() >= 0 ? '+' : ''}{calculateTotalProfitLossPercentage().toFixed(2)}%
                                </p>
                                <p className={`text-sm text-gray-400`}>
                                    {calculateTotalProfitLoss() >= 0 ? '+' : ''}{calculateTotalProfitLoss().toFixed(2)} $
                                </p>
                            </div>
                        </div>
                    </div>

                    {(() => {
                        const activeTokens = user.walletData.tokenData.filter(token => {
                            if (!token) return false;
                            const cryptoData = cryptos.find(c => c.id === token.id);
                            const currentPrice = cryptoData?.current_price || 0;
                            const totalValue = (token.quantity || 0) * currentPrice;
                            return totalValue > 0;
                        });

                        if (activeTokens.length === 0) {
                            return (
                                <div className="mt-8 text-center py-12 text-gray-400 bg-zinc-900/50 rounded-xl">
                                    <p>Vous n'avez pas encore de crypto-monnaies</p>
                                </div>
                            );
                        }

                        return (
                            <div className="mt-8">
                                <h2 className="text-xl font-bold mb-6 text-left">Mes Crypto-monnaies</h2>
                                <div className="bg-zinc-900/50 rounded-xl overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-gray-400">
                                                <th className="p-4 font-medium text-left">Crypto</th>
                                                <th className="p-4 font-medium text-left">Quantité</th>
                                                <th className="p-4 font-medium text-left">Valeur unitaire à l'achat</th>
                                                <th className="p-4 font-medium text-left">Valeur unitaire actuelle</th>
                                                <th className="p-4 font-medium text-left">Valeur total à l'achat</th>
                                                <th className="p-4 font-medium text-left">Valeur total actuelle</th>
                                                <th className="p-4 font-medium text-left">Variation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeTokens.map(token => {
                                                const cryptoData = cryptos.find(c => c.id === token.id);
                                                const purchasePrice = token.purchasePrice || 0;
                                                const currentPrice = cryptoData?.current_price || purchasePrice;
                                                const totalPurchaseValue = (token.quantity || 0) * purchasePrice;
                                                const totalValue = (token.quantity || 0) * currentPrice;
                                                const quantity = token.quantity || 0;
                                                const priceChange = purchasePrice ? ((totalValue - totalPurchaseValue) / totalPurchaseValue) * 100 : 0;

                                                return (
                                                    <tr 
                                                        key={token.id}
                                                        className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                                                    >
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <img src={cryptoData?.image || token.image} alt={token.name} className="w-8 h-8 rounded-full" />
                                                                <span className="font-medium">{(token.symbol || '').toUpperCase()}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-left">{quantity.toFixed(8)}</td>
                                                        <td className="p-4 text-left">{purchasePrice.toFixed(2)} $</td>
                                                        <td className="p-4 text-left">{currentPrice.toFixed(2)} $</td>
                                                        <td className="p-4 text-left">{totalPurchaseValue.toFixed(2)} $</td>
                                                        <td className="p-4 text-left">{totalValue.toFixed(2)} $</td>
                                                        <td className={`p-4 text-left ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                            {priceChange.toFixed(2)}%
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })()}

                </div>
            </div>

            <FundingModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
