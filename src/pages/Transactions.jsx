import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCrypto } from '../contexts/CryptoContext';
import Navbar from '../components/Navbar';

export default function Transactions() {
    const { user, updateUser } = useAuth();
    const { cryptos } = useCrypto();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedToken, setSelectedToken] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUsers(storedUsers.filter(u => u.accountData.id !== user.accountData.id));
    }, [user.accountData.id]);

    const userTokens = user.walletData.tokenData.filter(token => {
        const cryptoData = cryptos.find(c => c.id === token.id);
        return cryptoData && token.quantity > 0;
    });

    const handleTransfer = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedUser || !selectedToken || !amount) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        const transferAmount = parseFloat(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            setError('Veuillez entrer un montant valide');
            return;
        }

        const tokenToTransfer = user.walletData.tokenData.find(t => t.id === selectedToken);
        if (!tokenToTransfer || tokenToTransfer.quantity < transferAmount) {
            setError('Solde insuffisant');
            return;
        }

        const recipientUser = users.find(u => u.accountData.id === selectedUser);
        const selectedCrypto = cryptos.find(c => c.id === selectedToken);
        const currentPrice = selectedCrypto ? selectedCrypto.current_price : 0;
        const totalValue = transferAmount * currentPrice;

        const senderTransferHistory = user.walletData.withdrawData || [];
        const newSenderTransfer = {
            type: 'transfer-out',
            tokenId: selectedToken,
            tokenSymbol: tokenToTransfer.symbol || selectedCrypto.symbol,
            tokenImage: tokenToTransfer.image || selectedCrypto.image,
            quantity: transferAmount,
            price: currentPrice,
            total: totalValue,
            to: recipientUser.accountData.username,
            timestamp: new Date().toISOString()
        };

        const recipientTransferHistory = recipientUser.walletData.withdrawData || [];
        const newRecipientTransfer = {
            type: 'transfer-in',
            tokenId: selectedToken,
            tokenSymbol: tokenToTransfer.symbol || selectedCrypto.symbol,
            tokenImage: tokenToTransfer.image || selectedCrypto.image,
            quantity: transferAmount,
            price: currentPrice,
            total: totalValue,
            from: user.accountData.username,
            timestamp: new Date().toISOString()
        };

        const updatedSenderTokens = user.walletData.tokenData.map(token => {
            if (token.id === selectedToken) {
                return {
                    ...token,
                    quantity: token.quantity - transferAmount
                };
            }
            return token;
        });

        const recipientTokenIndex = recipientUser.walletData.tokenData.findIndex(t => t.id === selectedToken);
        let updatedRecipientTokens = [...recipientUser.walletData.tokenData];

        if (recipientTokenIndex !== -1) {
            updatedRecipientTokens[recipientTokenIndex] = {
                ...updatedRecipientTokens[recipientTokenIndex],
                quantity: updatedRecipientTokens[recipientTokenIndex].quantity + transferAmount
            };
        } else {
            updatedRecipientTokens.push({
                ...tokenToTransfer,
                quantity: transferAmount
            });
        }

        updateUser({
            walletData: {
                ...user.walletData,
                tokenData: updatedSenderTokens,
                withdrawData: [...senderTransferHistory, newSenderTransfer]
            }
        });

        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = allUsers.map(u => {
            if (u.accountData.id === selectedUser) {
                return {
                    ...u,
                    walletData: {
                        ...u.walletData,
                        tokenData: updatedRecipientTokens,
                        withdrawData: [...recipientTransferHistory, newRecipientTransfer]
                    }
                };
            }
            if (u.accountData.id === user.accountData.id) {
                return {
                    ...u,
                    walletData: {
                        ...u.walletData,
                        tokenData: updatedSenderTokens,
                        withdrawData: [...senderTransferHistory, newSenderTransfer]
                    }
                };
            }
            return u;
        });
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        setSelectedToken('');
        setAmount('');
        setSuccess('Transfert effectué avec succès !');
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <div className="ml-20 h-screen overflow-y-auto">
                <div className="w-full p-8">
                    <h1 className="text-3xl font-bold mb-8 text-left">Transactions</h1>

                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                        <h2 className="text-xl font-bold mb-6 text-left">Envoyer des cryptos</h2>

                        <form onSubmit={handleTransfer} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="p-3 bg-green-500/10 border border-green-500 text-green-500 rounded-lg text-sm">
                                    {success}
                                </div>
                            )}

                            <div>
                                <label htmlFor="user" className="block text-sm text-left font-medium text-gray-400 mb-2">
                                    Destinataire
                                </label>
                                <div className="relative">
                                    <select
                                        id="user"
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-12 p-3 text-white focus:outline-none focus:border-blue-500 appearance-none"
                                    >
                                        <option value="">Sélectionner un utilisateur</option>
                                        {users.map((u) => (
                                            <option key={u.accountData.id} value={u.accountData.id}>
                                                {u.accountData.firstName} {u.accountData.lastName} ({u.accountData.email})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {selectedUser ? (
                                            <img
                                                src={users.find(u => u.accountData.id === selectedUser)?.accountData.profilePic || 
                                                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(users.find(u => u.accountData.id === selectedUser)?.accountData.email)}`}
                                                alt="Profile"
                                                className="w-6 h-6 rounded-full"
                                            />
                                        ) : (
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="token" className="block text-sm text-left font-medium text-gray-400 mb-2">
                                    Crypto à envoyer
                                </label>
                                <div className="relative">
                                    <select
                                        id="token"
                                        value={selectedToken}
                                        onChange={(e) => setSelectedToken(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-12 p-3 text-white focus:outline-none focus:border-blue-500 appearance-none"
                                    >
                                        <option value="">Sélectionner une crypto</option>
                                        {userTokens.map((token) => {
                                            const cryptoData = cryptos.find(c => c.id === token.id);
                                            return (
                                                <option key={token.id} value={token.id}>
                                                    {cryptoData.name} - Solde: {token.quantity}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {selectedToken ? (
                                            <img
                                                src={cryptos.find(c => c.id === selectedToken)?.image}
                                                alt="Crypto"
                                                className="w-6 h-6 rounded-full"
                                            />
                                        ) : (
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="amount" className="block text-sm text-left font-medium text-gray-400 mb-2">
                                    Montant
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-12 p-3 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="Quantité à envoyer"
                                        step="any"
                                        min="0"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                            >
                                Envoyer
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}