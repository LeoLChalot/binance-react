import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function FundingModal({ isOpen, onClose, type = 'deposit' }) {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user, updateUser } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const fundingAmount = parseFloat(amount);
        if (isNaN(fundingAmount) || fundingAmount <= 0) {
            setError('Veuillez entrer un montant valide');
            return;
        }

        if (type === 'withdraw' && fundingAmount > user.walletData.balance) {
            setError('Solde insuffisant');
            return;
        }

        const updatedBalance = type === 'deposit' 
            ? user.walletData.balance + fundingAmount
            : user.walletData.balance - fundingAmount;

        updateUser({
            ...user,
            walletData: {
                ...user.walletData,
                balance: updatedBalance
            }
        });

        setSuccess(type === 'deposit' ? 'Compte crédité avec succès !' : 'Retrait effectué avec succès !');
        setAmount('');
        setTimeout(() => {
            onClose();
            setSuccess('');
        }, 2000);
    };

    if (!isOpen) return null;

    const isDeposit = type === 'deposit';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-6">
                    {isDeposit ? 'Créditer mon compte' : 'Retirer de mon compte'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-2">
                            {isDeposit ? 'Montant à créditer ($)' : 'Montant à retirer ($)'}
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Entrez le montant..."
                            className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                            min="0"
                            max={type === 'withdraw' ? user.walletData.balance : undefined}
                            step="0.01"
                        />
                        {type === 'withdraw' && (
                            <p className="text-sm text-gray-400 mt-2">
                                Solde disponible : {user.walletData.balance.toFixed(2)} $
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-200 text-sm">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`w-full ${
                            isDeposit 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-red-600 hover:bg-red-700'
                        } text-white font-medium py-3 px-4 rounded-lg transition-colors`}
                    >
                        {isDeposit ? 'Créditer' : 'Retirer'}
                    </button>
                </form>
            </div>
        </div>
    );
}
