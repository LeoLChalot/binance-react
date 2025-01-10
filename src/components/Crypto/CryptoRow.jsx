import React from 'react';

export default function CryptoRow({ crypto, onClick }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price).replace(/,/, ' ');
    };

    const formatLargeNumber = (number) => {
        if (number >= 1e9) {
            return `${(number / 1e9).toFixed(2)} Mrd $`;
        }
        if (number >= 1e6) {
            return `${(number / 1e6).toFixed(2)} M $`;
        }
        return formatPrice(number);
    };

    const formatPercentage = (percentage) => {
        return `${percentage.toFixed(2)}%`;
    };

    return (
        <tr 
            className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer" 
            onClick={onClick}
        >
            <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                    <img 
                        className="h-8 w-8 rounded-full" 
                        src={crypto.image} 
                        alt={crypto.name}
                    />
                    <div>
                        <div className="font-medium text-white">{crypto.name}</div>
                        <div className="text-sm text-gray-400 uppercase">{crypto.symbol}</div>
                    </div>
                </div>
            </td>
            <td className="py-4 px-6 text-right font-medium">
                {formatPrice(crypto.current_price)}
            </td>
            <td className="py-4 px-6 text-right text-gray-300">
                {formatLargeNumber(crypto.market_cap)}
            </td>
            <td className="py-4 px-6 text-right text-gray-300">
                {formatLargeNumber(crypto.total_volume)}
            </td>
            <td className="py-4 px-6 text-right">
                <span 
                    className={`inline-block px-2.5 py-1 rounded-lg text-sm font-medium ${
                        crypto.price_change_percentage_24h >= 0 
                        ? 'text-green-400 bg-green-400/10' 
                        : 'text-red-400 bg-red-400/10'
                    }`}
                >
                    {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                    {formatPercentage(crypto.price_change_percentage_24h)}
                </span>
            </td>
        </tr>
    );
}