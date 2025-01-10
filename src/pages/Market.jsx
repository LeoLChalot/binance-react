import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import CryptoList from '../components/CryptoList';

export default function Market() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cryptos, setCryptos] = useState([])
    const [crypto, setCrypto] = useState({})

    const API_URL = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
                    {
                        headers: {
                            'X-x-cg-demo-api-key': API_KEY
                        }
                    }
                );
                const data = await response.json();
                setCryptos(data);
            } catch (error) {
                console.error('Error fetching crypto data:', error);
            }
        };

        fetchCryptos();
    }, []);

    const handleCryptoClick = (crypto) => {
        navigate(`/market/${crypto.id}`);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <div className="ml-20 h-screen overflow-y-auto">
                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-6 text-left">Marché</h1>
                    <CryptoList cryptos={cryptos} onCryptoClick={handleCryptoClick} />
                </div>
            </div>
        </div>
    );
}
