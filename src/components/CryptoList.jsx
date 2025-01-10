import React from 'react';
import CryptoRow from './CryptoRow';

export default function CryptoList({ cryptos }) {
    const handleCryptoClick = (crypto) => {
        console.log('Clicked crypto:', crypto);
    };

    return (
        <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-gray-400 border-b border-zinc-800">
                            <th className="py-4 px-6 font-medium">
                                <div className="ml-11">Crypto</div>
                            </th>
                            <th className="py-4 px-6 font-medium text-right">Prix</th>
                            <th className="py-4 px-6 font-medium text-right">Capitalisation</th>
                            <th className="py-4 px-6 font-medium text-right">Volume (24h)</th>
                            <th className="py-4 px-6 font-medium text-right">Variation (24h)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cryptos.map((crypto) => (
                            <CryptoRow 
                                key={crypto.id} 
                                crypto={crypto} 
                                onClick={() => handleCryptoClick(crypto)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}