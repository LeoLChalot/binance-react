import { useEffect, useState } from "react";
import LineChart from "./CustomLineChart";

export default function Chart({ cryptoId }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [crypto, setCrypto] = useState("bitcoin");
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState([]);

  const fetchPriceHistory = async () => {
    const params = {
      vs_currency: 'usd',
      from: 1733871605,
      to: 1736463605
    };
    const url = new URL(`${API_URL}/coins/${cryptoId}/market_chart/range`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
      const response = await fetch(url, {
        headers: {
          "X-x-cg-demo-api-key": API_KEY,
        },
      });
      const data = await response.json();
      console.log("Raw data:", data);
      setRawData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const processLineData = (data) => {
    const groupedData = {};
    data.forEach(([timestamp, close]) => {
      const date = new Date(timestamp).toISOString().split("T")[0]; // Regrouper par jour
      if (!groupedData[date]) {
        groupedData[date] = close; // Utiliser le prix de clôture par jour
      }
    });
    
    // Convertir les données en tableau
    return Object.entries(groupedData).map(([date, close]) => ({
      date,
      close,
    }));
  };

  const fetchData = async () => {
    await fetchPriceHistory(crypto);
  };

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
      <div className="mt-3 w-full flex justify-center items-center">
        <div className="w-full h-auto">
          <LineChart cryptoName={cryptoId} data={ rawData } />
        </div>
      </div>
    </>
  )
}
