import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function Wallet() {
    const { user } = useAuth();
    const allTransactions = [
        ...user.walletData.investHistory.map(t => ({ ...t, type: 'Investissement' })),
        ...user.walletData.withdrawHistory.map(t => ({ ...t, type: 'Retrait' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <div className="ml-20 p-8">
                <h1 className="text-3xl font-bold mb-6 text-left">Portefeuille</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-zinc-800 rounded-lg p-4">
                        <p className="text-white/70 mb-1">Solde total</p>
                        <p className="text-2xl font-bold">{user.walletData.balance} €</p>
                    </div>
                    <div className="bg-zinc-800 rounded-lg p-4">
                        <p className="text-white/70 mb-1">Nombre de transactions</p>
                        <p className="text-2xl font-bold">{allTransactions.length}</p>
                    </div>
                </div>

                {allTransactions.length > 0 ? (
                    <div className="bg-zinc-800 rounded-lg p-4">
                        <h2 className="text-xl font-bold mb-4">Historique des transactions</h2>
                        <div className="space-y-4">
                            {allTransactions.map((transaction, index) => (
                                <div key={index} className="flex justify-between items-center border-b border-zinc-700 pb-4">
                                    <div>
                                        <p className="font-medium">{transaction.type}</p>
                                        <p className="text-white/70 text-sm">{new Date(transaction.date).toLocaleString('fr-FR')}</p>
                                    </div>
                                    <p className={transaction.type === 'Investissement' ? 'text-green-500' : 'text-red-500'}>
                                        {transaction.type === 'Investissement' ? '+' : '-'}{transaction.amount} €
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-white/70">Aucune transaction pour le moment</p>
                )}
            </div>
        </div>
    );
}
