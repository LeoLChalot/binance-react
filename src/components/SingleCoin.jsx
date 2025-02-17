import React, { useState, useEffect } from "react";
import { DollarSign, Info } from "lucide-react";
import Comments from "./Comments";
import Chart from "./Chart/Chart";
import TradeModal from "./Modal/TradeModal";

const SingleCoin = ({ cryptoId }) => {
  const [cryptoData, setCryptoData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}`,
          {
            method: "GET",
            headers: {
              "x-cg-demo-api-key": import.meta.env.VITE_API_KEY,
            },
          }
        );
        const data = await response.json();
        setCryptoData(data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    fetchCryptoData();
  }, [cryptoId]);

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  if (!cryptoData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const priceChangeColor = cryptoData.market_data.price_change_percentage_24h >= 0 
    ? 'text-green-500' 
    : 'text-red-500';

  return (
    <div className="flex flex-col gap-6 w-full mt-8">
      <div className="flex-1 flex-col">
        <div className="bg-zinc-900 rounded-xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={cryptoData.image.small}
              alt={cryptoData.name}
              className="w-16 h-16 rounded-lg shadow-md"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">
                {cryptoData.name}
              </h1>
              <p className="text-gray-400 text-left">
                {cryptoData.symbol.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="col-span-1 bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-6 h-6 text-yellow-500" />
                <h2 className="text-lg font-bold text-white">Valeur actuelle</h2>
              </div>
              <div className={`${priceChangeColor} text-xl`}>
                <span className="text-2xl font-bold text-white mr-4">
                  ${cryptoData.market_data.current_price.usd.toLocaleString()}
                </span>
                {cryptoData.market_data.price_change_percentage_24h > 0 ? '+' : ''}
                {cryptoData.market_data.price_change_percentage_24h.toFixed(2)}%
              </div>
              <span className="text-gray-400 text-md">
                €{cryptoData.market_data.current_price.eur.toLocaleString()} EUR
              </span>
            </div>

            <div className="col-span-2 bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-6 h-6 text-yellow-500" />
                <h2 className="text-lg font-bold text-white">Informations</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Classement</span>
                    <span className="text-white font-semibold">#{cryptoData.market_cap_rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume 24h</span>
                    <span className="text-white font-semibold">${cryptoData.market_data.total_volume.usd.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Capacité de marché</span>
                    <span className="text-white font-semibold">${cryptoData.market_data.market_cap.usd.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Offre en circulation</span>
                    <span className="text-white font-semibold">{cryptoData.market_data.circulating_supply.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
            <button 
              onClick={() => handleOpenModal('buy')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md w-full md:w-1/2 transition-colors"
            >
              Acheter
            </button>
            <button 
              onClick={() => handleOpenModal('alert')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md shadow-md w-full md:w-1/2 transition-colors"
            >
              Mettre un rappel
            </button>
            <button 
              onClick={() => handleOpenModal('sell')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md w-full md:w-1/2 transition-colors"
            >
              Vendre
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Chart cryptoId={cryptoId} />
          </div>
        </div>
      </div>
      <Comments cryptoId={cryptoId} />
      
      {isModalOpen && (
        <TradeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          type={modalType}
          cryptoData={cryptoData}
        />
      )}
    </div>
  );
}

export default SingleCoin;
