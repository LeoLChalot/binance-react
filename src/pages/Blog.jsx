import React, { useState, useEffect } from 'react';
import { useCrypto } from '../contexts/CryptoContext';
import Comments from '../components/Comments';
import Navbar from '../components/Navbar';
import { ArrowLeft } from 'lucide-react';

export default function Blog() {
    const [comments, setComments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { cryptos, loading, error, lastUpdate } = useCrypto();
    const [filteredCryptos, setFilteredCryptos] = useState([]);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [allComments, setAllComments] = useState({});

    useEffect(() => {
        const storedComments = JSON.parse(localStorage.getItem('comments')) || {};
        setAllComments(storedComments);
        if (selectedCrypto) {
            const commentsForCrypto = storedComments[selectedCrypto] || [];
            setComments(commentsForCrypto);
        }
    }, [selectedCrypto]);

    useEffect(() => {
        const filtered = cryptos.filter(crypto =>
            crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCryptos(filtered);
    }, [searchTerm, cryptos]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value === '') {
            setSelectedCrypto(null);
        }
    };

    const handleCryptoSelect = (crypto) => {
        setSelectedCrypto(crypto.id);
        setSearchTerm('');
    };

    const handleBackToAll = () => {
        setSelectedCrypto(null);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <main className="ml-20 h-screen overflow-y-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        {selectedCrypto ? (
                            <h1 className="text-3xl font-bold text-left">Commentaires pour {selectedCrypto}</h1>
                        ) : (
                            <h1 className="text-3xl font-bold text-left">Blog</h1>
                        )}
                        <input
                            type="text"
                            className="block w-1/5 pl-2 pr-2 py-2 border border-zinc-800 rounded-lg bg-zinc-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Rechercher une cryptomonnaie..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="mb-4">
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
                    {!searchTerm && (selectedCrypto ? (
                        <>
                            {selectedCrypto && (
                                <button
                                    onClick={handleBackToAll}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span>Retour à tous les commentaires</span>
                                </button>
                            )}
                            {comments.length > 0 ? (
                                <Comments key={selectedCrypto} cryptoId={selectedCrypto}/>
                            ) : (
                                <p className="text-gray-500">Aucun commentaire pour cette cryptomonnaie.</p>
                            )}
                        </>
                    ) : (
                        <div className="space-y-8">
                            {Object.entries(allComments).map(([cryptoId, cryptoComments]) => (
                                cryptoComments.length > 0 && (
                                    <div key={cryptoId} className="mb-8">
                                        <div className='flex items-center gap-x-3 mb-4'>
                                            <img src={cryptos.find(crypto => crypto.id === cryptoId)?.image} alt={cryptoId} className="w-9 h-9" />
                                            <h2 className="text-2xl font-bold text-left">{cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1)}</h2>
                                        </div>
                                        <Comments key={cryptoId} cryptoId={cryptoId}/>
                                    </div>
                                )
                            ))}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}