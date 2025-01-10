import React, { useState, useEffect } from "react";
import { DollarSign, Info } from "lucide-react";
import Comments from "./Comments";
import Chart from "./Chart/Chart";

const SingleCoin = ({ cryptoId }) => {
  const [cryptoData, setCryptoData] = useState(null);


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

  if (!cryptoData) {
    return <div className="text-center text-gray-500">Chargement...</div>;
  }

  return (
    <div className="flex gap-6 w-full p-4">
        <div className="flex-1 flex-col items-center">

      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="flex items-center gap-4">
          <img
            src={cryptoData.image.small}
            alt={cryptoData.name}
            className="w-12 h-12"
            />
          <h1 className="text-2xl font-bold yellow-text">
            {cryptoData.name} ({cryptoData.symbol.toUpperCase()})
          </h1>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <DollarSign className="w-6 h-6 text-green-500" />
          <span className="text-xl font-semibold text-white">
            {cryptoData.market_data.current_price.usd} USD
          </span>
          <span className="text-gray-500">
            ({cryptoData.market_data.current_price.eur} EUR)
          </span>
        </div>

        <div className="w-3/6 mt-6 p-4 border rounded-lg bg-dark-50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Info className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">Informations supplémentaires</h2>
          </div>
          <p className="text-sm text-white">
            Classement du marché : {cryptoData.market_cap_rank}
          </p>
          <p className="text-sm text-white">
            Volume total : {cryptoData.market_data.total_volume.usd} USD
          </p>
        </div>
      </div>
        <Chart cryptoId={cryptoId}/>
        </div>
      <Comments cryptoId={cryptoId}/>
    </div>
  );
}
export default SingleCoin;
