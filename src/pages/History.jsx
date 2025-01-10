import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCrypto } from '../contexts/CryptoContext';
import Navbar from '../components/Navbar';
import { Calendar, ArrowUpRight, ArrowDownRight, RefreshCw, Plus, Minus } from 'lucide-react';

export default function History() {
    const { user } = useAuth();
    const { cryptos } = useCrypto();
    const [selectedType, setSelectedType] = useState('all');

    if (!user?.walletData) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar navbarConnected />
                <div className="ml-20 h-screen overflow-y-auto">
                    <div className="p-8">
                        <div className="flex flex-col justify-center items-start">
                            <h1 className="text-3xl font-bold text-left">Historique des transactions</h1>
                        </div>
                        <div className="mt-8 text-center py-12 text-gray-400 bg-zinc-900/50 rounded-xl">
                            <p>Chargement de l'historique...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(price);
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'buy':
                return <ArrowDownRight className="w-5 h-5 text-green-500" />;
            case 'sell':
                return <ArrowUpRight className="w-5 h-5 text-red-500" />;
            case 'transfer-in':
                return <ArrowDownRight className="w-5 h-5 text-blue-500" />;
            case 'transfer-out':
                return <ArrowUpRight className="w-5 h-5 text-orange-500" />;
            case 'deposit':
                return <Plus className="w-5 h-5 text-emerald-500" />;
            case 'withdraw':
                return <Minus className="w-5 h-5 text-purple-500" />;
            default:
                return <RefreshCw className="w-5 h-5 text-gray-500" />;
        }
    };

    const getTransactionLabel = (type) => {
        switch (type) {
            case 'buy':
                return 'Achat';
            case 'sell':
                return 'Vente';
            case 'transfer-in':
                return 'Réception';
            case 'transfer-out':
                return 'Envoi';
            case 'deposit':
                return 'Dépôt';
            case 'withdraw':
                return 'Retrait';
            default:
                return 'Transaction';
        }
    };

    const allTransactions = [
        ...(user.walletData.investHistory || []),
        ...(user.walletData.withdrawData || []),
        ...(user.walletData.fundingHistory || []).map(t => ({
            ...t,
            tokenId: 'usd',
            tokenSymbol: 'USD',
            quantity: t.amount,
            price: 1,
            total: t.amount
        }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const filteredTransactions = selectedType === 'all' 
        ? allTransactions 
        : allTransactions.filter(t => t.type === selectedType);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <div className="ml-20 h-screen overflow-y-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Historique des transactions</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedType('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    selectedType === 'all'
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                                }`}
                            >
                                Tout
                            </button>
                            <button
                                onClick={() => setSelectedType('deposit')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    selectedType === 'deposit'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                                }`}
                            >
                                Dépôts
                            </button>
                            <button
                                onClick={() => setSelectedType('withdraw')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    selectedType === 'withdraw'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                                }`}
                            >
                                Retraits
                            </button>
                            <button
                                onClick={() => setSelectedType('buy')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    selectedType === 'buy'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                                }`}
                            >
                                Achats
                            </button>
                            <button
                                onClick={() => setSelectedType('sell')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    selectedType === 'sell'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                                }`}
                            >
                                Ventes
                            </button>
                            <button
                                onClick={() => setSelectedType('transfer-in')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    selectedType === 'transfer-in'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                                }`}
                            >
                                Reçus
                            </button>
                            <button
                                onClick={() => setSelectedType('transfer-out')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    selectedType === 'transfer-out'
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                                }`}
                            >
                                Envoyés
                            </button>
                        </div>
                    </div>

                    {filteredTransactions.length > 0 ? (
                        <div className="bg-zinc-900/50 rounded-xl overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-400 border-b border-zinc-800">
                                        <th className="p-4 font-medium">Type</th>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium">Crypto</th>
                                        <th className="p-4 font-medium">Quantité</th>
                                        <th className="p-4 font-medium">Prix unitaire</th>
                                        <th className="p-4 font-medium">Total</th>
                                        {selectedType.includes('transfer') && (
                                            <th className="p-4 font-medium">
                                                {selectedType === 'transfer-in' ? 'Expéditeur' : 'Destinataire'}
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((transaction, index) => {
                                        const crypto = transaction.tokenId === 'usd' ? null : cryptos.find(c => c.id === transaction.tokenId);
                                        return (
                                            <tr 
                                                key={index}
                                                className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        {getTransactionIcon(transaction.type)}
                                                        <span className="font-medium">
                                                            {getTransactionLabel(transaction.type)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        {formatDate(transaction.timestamp)}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        {transaction.tokenId === 'usd' ? (
                                                            <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                                                <span className="text-green-500 text-xs">$</span>
                                                            </div>
                                                        ) : (
                                                            <img 
                                                                src={crypto?.image || transaction.tokenImage} 
                                                                alt={transaction.tokenSymbol}
                                                                className="w-6 h-6 rounded-full"
                                                            />
                                                        )}
                                                        <span className="font-medium">
                                                            {transaction.tokenSymbol}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {transaction.quantity?.toFixed(6)}
                                                </td>
                                                <td className="p-4">
                                                    {formatPrice(transaction.price || 1)}
                                                </td>
                                                <td className="p-4 font-medium">
                                                    {formatPrice(transaction.total || transaction.amount)}
                                                </td>
                                                {selectedType.includes('transfer') && (
                                                    <td className="p-4 text-gray-400">
                                                        {selectedType === 'transfer-in' ? transaction.from : transaction.to}
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="mt-8 text-center py-12 text-gray-400 bg-zinc-900/50 rounded-xl">
                            <p>Aucune transaction à afficher</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
