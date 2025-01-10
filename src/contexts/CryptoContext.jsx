import React, { createContext, useState, useContext, useEffect } from 'react';

const CryptoContext = createContext();

export function useCrypto() {
    return useContext(CryptoContext);
}

export function CryptoProvider({ children }) {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;

    const fetchCryptos = async () => {
        try {
            const response = await fetch(
                `${API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`,
                {
                    headers: {
                        'x-cg-demo-api-key': API_KEY
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données');
            }
            
            const data = await response.json();
            setCryptos(data);
            setLastUpdate(new Date());
            setError(null);
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCryptos();

        const interval = setInterval(() => {
            fetchCryptos();
        }, 60000); 

        return () => clearInterval(interval);
    }, []);

    const getCryptoById = (id) => {
        return cryptos.find(crypto => crypto.id === id);
    };

    const value = {
        cryptos,
        loading,
        error,
        lastUpdate,
        getCryptoById
    };

    return (
        <CryptoContext.Provider value={value}>
            {children}
        </CryptoContext.Provider>
    );
}
