import { useEffect, useState } from 'react'


export default function fetchCryptos() {
    const [cryptos, setCryptos] = useState([])
    const [crypto, setCrypto] = useState({})

    const API_URL = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;

    const fetchCryptos = async () => {
        const params = {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
        };
        const url = new URL(`${API_URL}/coins/markets`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        await fetch(url, {
            headers: {
                'X-x-cg-demo-api-key': API_KEY
            }
        }).then(res => res.json())
            .then(data => setCryptos(data))
            .catch(error => console.error('Error:', error))

        for (const itemCrypto of cryptos) {
            console.table(itemCrypto)
        }
    }
    
    useEffect(() => {
        fetchCryptos()
    }, [])
}