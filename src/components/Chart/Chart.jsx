import { useEffect, useState } from 'react'
import LineChart from './CustomLineChart';

export default function Chart({ cryptoId }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [crypto, setCrypto] = useState("bitcoin")
  const [rawData, setRawData] = useState([])
  const [processedData, setProcessedData] = useState([])

  /* const fetchPriceHistory = async (crypto) => {

      const params = {
        vs_currency: 'usd',
        days: 30,
      };
      const url = new URL(`${API_URL}/coins/${crypto}/ohlc`);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

      await fetch(url, {
        headers: {
          'X-x-cg-demo-api-key': API_KEY
        }
      }).then(res => res.json())
        .then(data => {
          console.log('Raw data:', data); // Log data
          setRawData(data);
        })
        .catch(error => console.error('Error:', error))


      nst processLineData = (data) => {
      const groupedData = {};
      data.forEach(([timestamp, close]) => {
        const date = new Date(timestamp).toISOString().split('T')[0]; // Regrouper par jour
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

   */

  const fetchPriceHistory = async (crypto) => {

    const params = {
      vs_currency: 'usd',
      days: 30,
    };
    const url = new URL(`${API_URL}/coins/${crypto}/market_chart/range`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    await fetch(url, {
      headers: {
        'X-x-cg-demo-api-key': API_KEY
      }
    }).then(res => res.json())
      .then(data => {
        console.log('Raw data:', data); // Log data
        setRawData(data);
      })
      .catch(error => console.error('Error:', error))
  }

  const processLineData = (data) => {
    setRawData(data.price);
  };


  const fetchData = async () => {
    await fetchPriceHistory(crypto);
    const formattedData = processLineData(rawData);
    console.log('Processed data:', formattedData); // Log processed data
    setProcessedData(formattedData);
  };

  useEffect(() => {
    // fetchData();
  }, [rawData])

  return (
    <>
      <div style={{ width: '800px', height: '600px' }}>
        <LineChart data={processedData} />
      </div>
    </>
  )
}