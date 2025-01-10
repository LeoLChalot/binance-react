import React, { useState, useEffect } from 'react';
import { useCrypto } from '../contexts/CryptoContext';
import Comments from '../components/Comments';
import Navbar from '../components/Navbar';

export default function Blog() {
    const [comments, setComments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { cryptos, loading, error, lastUpdate } = useCrypto();
    const [filteredCryptos, setFilteredCryptos] = useState([]);
    const [selectedCrypto, setSelectedCrypto] = useState(null);

    useEffect(() => {
        const storedComments = JSON.parse(localStorage.getItem('comments')) || {};
        console.log(`Stored comments:`, storedComments);
        const commentsForCrypto = storedComments[selectedCrypto] || [];
        console.log(`Comments for ${selectedCrypto}:`, commentsForCrypto);
        setComments(commentsForCrypto);
    }, [selectedCrypto]);

    useEffect(() => {
        const filtered = cryptos.filter(crypto =>
            crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCryptos(filtered);
    }, [searchTerm, cryptos]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCryptoSelect = (crypto) => {
        setSelectedCrypto(crypto.id);
        setSearchTerm('');
    };

    return (
        <div className="h-full w-full flex flex-col bg-black">

            <Navbar navbarConnected />

            <main className="flex-1 w-full">
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Commentaires pour {selectedCrypto}</h1>
                    <div className="mb-4">
                        <input
                            type="text"
                            className="w-1/5 p-2 border rounded-lg focus:ring focus:ring-purple-300"
                            placeholder="Rechercher une cryptomonnaie..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        {searchTerm && (
                            <div className="grid w-10/12 mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                {filteredCryptos.map((crypto, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border rounded-lg cursor-pointer hover:bg-gray-900 items-center justify-center flex flex-col"
                                        onClick={() => handleCryptoSelect(crypto)}
                                    >
                                        <img src={crypto.image} alt={crypto.name} className="w-12 h-12 mb-2" />
                                        <h2 className="text-lg font-bold text-white">{crypto.name}</h2>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Comments key={selectedCrypto} cryptoId={selectedCrypto}/>
                </div>
            </main>
        </div>

    );
}