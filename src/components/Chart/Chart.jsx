import { useEffect, useState } from "react";
import LineChart from "./CustomLineChart";

export default function Chart({ cryptoId }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [crypto, setCrypto] = useState("bitcoin");
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPriceHistory = async () => {
    const params = {
      vs_currency: 'usd',
      from: 1733871605,
      to: 1736463605
    };
    const url = new URL(`${API_URL}/coins/${crypto}/market_chart/range`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
      setLoading(true);
      setError(null);
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
      setError(error.message);
    } finally {
      setLoading(false);
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
    const formattedData = processLineData(rawData);
    console.log("Processed data:", formattedData);
    setProcessedData(formattedData);
  };

  useEffect(() => {
    fetchData();
  }, [])

  if (loading) {
    return (
      <div className="mt-3 w-full flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <>
      <div style={{ width: '800px', height: '600px' }}>
        <LineChart cryptoName={cryptoId} data={rawData} />
      </div>
    </>
  )
}
