import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { X, AlertTriangle } from 'lucide-react';

const TradeModal = ({ isOpen, onClose, type, cryptoData }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [alertType, setAlertType] = useState('above');
    const { user, updateUser } = useAuth();
    const { addAlert } = useAlert();

    if (!isOpen || !cryptoData || !user?.walletData) return null;

    const handleTrade = () => {
        setError('');
        setSuccess('');
        const value = parseFloat(amount);

        if (isNaN(value) || value <= 0) {
            setError('Veuillez entrer un montant valide');
            return;
        }

        const currentPrice = cryptoData.market_data.current_price.usd;
        const tokenData = user.walletData.tokenData || [];
        const investHistory = user.walletData.investHistory || [];
        const existingToken = tokenData.find(token => token.id === cryptoData.id);
        const currentQuantity = existingToken ? existingToken.quantity : 0;

        switch (type) {
            case 'buy':
                const totalCost = value * currentPrice;
                if (totalCost > user.walletData.balance) {
                    setError('Solde insuffisant');
                    return;
                }

                let updatedTokenData = [...tokenData];
                const existingTokenIndex = tokenData.findIndex(
                    token => token.id === cryptoData.id
                );

                if (existingTokenIndex !== -1) {
                    const existingToken = updatedTokenData[existingTokenIndex];
                    const totalQuantity = existingToken.quantity + value;
                    const averagePrice = ((existingToken.purchasePrice * existingToken.quantity) + (currentPrice * value)) / totalQuantity;
                    
                    updatedTokenData[existingTokenIndex] = {
                        ...existingToken,
                        quantity: totalQuantity,
                        purchasePrice: averagePrice,
                        lastUpdated: new Date().toISOString()
                    };
                } else {
                    updatedTokenData.push({
                        id: cryptoData.id,
                        symbol: cryptoData.symbol,
                        name: cryptoData.name,
                        image: cryptoData.image.small,
                        quantity: value,
                        purchasePrice: currentPrice,
                        timestamp: new Date().toISOString()
                    });
                }

                const newInvestHistory = [
                    ...investHistory,
                    {
                        type: 'buy',
                        tokenId: cryptoData.id,
                        tokenSymbol: cryptoData.symbol,
                        quantity: value,
                        price: currentPrice,
                        total: totalCost,
                        timestamp: new Date().toISOString()
                    }
                ];

                updateUser({
                    walletData: {
                        ...user.walletData,
                        balance: user.walletData.balance - totalCost,
                        tokenData: updatedTokenData,
                        investHistory: newInvestHistory
                    }
                });

                setSuccess('Achat réussi de ' + value + ' ' + cryptoData.symbol.toUpperCase());
                break;

            case 'sell':
                if (value > currentQuantity) {
                    setError('Quantité insuffisante');
                    return;
                }

                const saleProceeds = value * currentPrice;
                let updatedTokenDataAfterSale = [...tokenData];
                const tokenIndex = tokenData.findIndex(token => token.id === cryptoData.id);

                if (tokenIndex !== -1) {
                    const remainingQuantity = currentQuantity - value;
                    if (remainingQuantity <= 0) {
                        updatedTokenDataAfterSale = updatedTokenDataAfterSale.filter(
                            (_, index) => index !== tokenIndex
                        );
                    } else {
                        updatedTokenDataAfterSale[tokenIndex] = {
                            ...updatedTokenDataAfterSale[tokenIndex],
                            quantity: remainingQuantity,
                            lastUpdated: new Date().toISOString()
                        };
                    }
                }

                const newInvestHistoryAfterSale = [
                    ...investHistory,
                    {
                        type: 'sell',
                        tokenId: cryptoData.id,
                        tokenSymbol: cryptoData.symbol,
                        quantity: value,
                        price: currentPrice,
                        total: saleProceeds,
                        timestamp: new Date().toISOString()
                    }
                ];

                updateUser({
                    walletData: {
                        ...user.walletData,
                        balance: user.walletData.balance + saleProceeds,
                        tokenData: updatedTokenDataAfterSale,
                        investHistory: newInvestHistoryAfterSale
                    }
                });

                setSuccess('Vente réussie de ' + value + ' ' + cryptoData.symbol.toUpperCase());
                break;

            case 'alert':
                const alertData = {
                    targetPrice: value,
                    currentPrice: currentPrice,
                    symbol: cryptoData.symbol,
                    name: cryptoData.name,
                    alertType: alertType,
                    timestamp: new Date().toISOString()
                };
                addAlert(cryptoData.id, alertData);
                setSuccess('Alerte de prix configurée pour ' + (alertType === 'above' ? 'supérieur' : 'inférieur') + ' à $' + value);
                break;
        }

        setTimeout(() => {
            if (success) {
                setAmount('');
                onClose();
            }
        }, 1500);
    };

    const getTitle = () => {
        switch (type) {
            case 'buy': return 'Acheter ' + cryptoData.name;
            case 'sell': return 'Vendre ' + cryptoData.name;
            case 'alert': return 'Définir une alerte pour ' + cryptoData.name;
            default: return '';
        }
    };

    const getPlaceholder = () => {
        switch (type) {
            case 'buy': return 'Quantité à acheter';
            case 'sell': return 'Quantité à vendre';
            case 'alert': return 'Prix cible ($)';
            default: return '';
        }
    };

    const existingToken = user.walletData.tokenData.find(token => token.id === cryptoData.id);
    const currentQuantity = existingToken ? existingToken.quantity : 0;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-6">{getTitle()}</h2>

                {type !== 'alert' && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg flex items-center justify-center gap-3">
                        <div className="text-sm text-yellow-200">
                            <p className="font-medium mb-1">Prix actuel: {cryptoData.market_data.current_price.usd} $</p>
                            {type === 'buy' && (
                                <>
                                    <p>Solde disponible: {user.walletData.balance.toFixed(2)} $</p>
                                    <p className="mt-1 text-yellow-400">
                                        Vous pouvez acheter jusqu'à {(user.walletData.balance / cryptoData.market_data.current_price.usd).toFixed(8)} {cryptoData.symbol.toUpperCase()}
                                    </p>
                                </>
                            )}
                            {type === 'sell' && (
                                <>
                                    <p>Quantité détenue: {currentQuantity} {cryptoData.symbol.toUpperCase()}</p>
                                    <p className="mt-1 text-yellow-400">
                                        Valeur totale: {(currentQuantity * cryptoData.market_data.current_price.usd).toFixed(2)} $
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {type === 'alert' && (
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setAlertType('above')}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                                    alertType === 'above'
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                Supérieur ou égal
                            </button>
                            <button
                                onClick={() => setAlertType('below')}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                                    alertType === 'below'
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                Inférieur ou égal
                            </button>
                        </div>
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg flex items-center justify-center gap-3">
                            <div className="text-sm text-yellow-200">
                                <p className="font-medium mb-1">Prix actuel: {cryptoData.market_data.current_price.usd} $</p>
                                <p>Vous serez notifié quand le prix sera {alertType === 'above' ? 'supérieur' : 'inférieur'} au prix cible</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={getPlaceholder()}
                            className="w-full mt-4 p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                        />
                    </div>

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

                    <button
                        onClick={handleTrade}
                        className={'w-full py-3 rounded-lg font-medium transition-colors ' + 
                            (type === 'buy' 
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : type === 'sell'
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            )}
                    >
                        {type === 'buy' ? 'Acheter' : type === 'sell' ? 'Vendre' : 'Définir l\'alerte'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradeModal;
