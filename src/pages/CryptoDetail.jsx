import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SingleCoin from '../components/SingleCoin';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CryptoDetail() {
    const { cryptoId } = useParams();

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <div className="ml-20 h-screen overflow-y-auto">
                <div className="p-8">
                    <div className="flex flex-col justify-center items-start">
                        <h1 className="text-3xl font-bold text-left">Détail de {cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1)}</h1>
                        <Link to={`/market`} className="flex items-center gap-x-2 mt-8 ">
                            <ArrowLeft size={18} />
                            Retour
                        </Link>
                    </div>
                    <SingleCoin cryptoId={cryptoId} />
                </div>
            </div>
        </div>
    );
}
