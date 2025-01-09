import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import CryptoRow from '../components/CryptoRow';
import { Navigate, useNavigate } from 'react-router-dom';

export default function CryptoList({ cryptos }) {
    const navigate = useNavigate();

    return (
        < div className="overflow-x-auto" >
            <table className="min-w-full bg-gray-800 rounded-lg">
                <thead>
                    <tr className="w-full bg-gray-900 text-left text-gray-400">
                        <th className="py-2 px-4">Rank</th>
                        <th className="py-2 px-4">Price</th>
                        <th className="py-2 px-4">Market Cap</th>
                        <th className="py-2 px-4">Volume</th>
                        <th className="py-2 px-4">Price Change</th>
                    </tr>
                </thead>
                <tbody>
                    {cryptos.map((crypto) => (
                        <CryptoRow key={crypto.id} crypto={crypto} onClick={() => navigate(`/market/${crypto.id}`)} />
                    ))}
                </tbody>
            </table>
        </div >

    )
}