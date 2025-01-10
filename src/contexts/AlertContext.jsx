import React, { createContext, useContext, useEffect, useState } from 'react';

const AlertContext = createContext();

export function useAlert() {
    return useContext(AlertContext);
}

export function AlertProvider({ children }) {
    const [alerts, setAlerts] = useState({});
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const storedAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '{}');
        setAlerts(storedAlerts);
    }, []);

    useEffect(() => {
        const checkAlerts = async () => {
            const currentAlerts = { ...alerts };
            let hasChanges = false;

            for (const [cryptoId, alert] of Object.entries(currentAlerts)) {
                try {
                    const response = await fetch(
                        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`,
                        {
                            method: "GET",
                            headers: {
                                "x-cg-demo-api-key": import.meta.env.VITE_API_KEY,
                            },
                        }
                    );
                    const data = await response.json();
                    const currentPrice = data[cryptoId]?.usd;

                    if (currentPrice) {
                        const targetPrice = parseFloat(alert.targetPrice);
                        const isTriggered = alert.alertType === 'above' 
                            ? currentPrice >= targetPrice
                            : currentPrice <= targetPrice;

                        if (isTriggered) {
                            setNotification({
                                type: 'price',
                                message: `${alert.name} a atteint ${currentPrice}$ (${alert.alertType === 'above' ? 'supérieur' : 'inférieur'} à ${targetPrice}$) Achat effectué !`,
                                timestamp: new Date().toISOString()
                            });

                            delete currentAlerts[cryptoId];
                            hasChanges = true;
                        }
                    }
                } catch (error) {
                    console.error('Erreur lors de la vérification du prix:', error);
                }
            }

            if (hasChanges) {
                setAlerts(currentAlerts);
                localStorage.setItem('priceAlerts', JSON.stringify(currentAlerts));
            }
        };

        const handlePriceUpdate = (event) => {
            const { cryptoId, data } = event.detail;
            const currentPrice = data[cryptoId]?.usd;
            
            if (currentPrice && alerts[cryptoId]) {
                const alert = alerts[cryptoId];
                const targetPrice = parseFloat(alert.targetPrice);
                const isTriggered = alert.alertType === 'above' 
                    ? currentPrice >= targetPrice
                    : currentPrice <= targetPrice;

                if (isTriggered) {
                    setNotification({
                        type: 'price',
                        message: `${alert.name} a atteint ${currentPrice}$ (${alert.alertType === 'above' ? 'supérieur' : 'inférieur'} à ${targetPrice}$.) Achat effectué !`,
                        timestamp: new Date().toISOString()
                    });

                    const newAlerts = { ...alerts };
                    delete newAlerts[cryptoId];
                    setAlerts(newAlerts);
                    localStorage.setItem('priceAlerts', JSON.stringify(newAlerts));
                }
            }
        };

        window.addEventListener('priceUpdate', handlePriceUpdate);
        const interval = setInterval(checkAlerts, 60000); 

        return () => {
            clearInterval(interval);
            window.removeEventListener('priceUpdate', handlePriceUpdate);
        };
    }, [alerts]);

    const addAlert = (cryptoId, alertData) => {
        const newAlerts = {
            ...alerts,
            [cryptoId]: alertData
        };
        setAlerts(newAlerts);
        localStorage.setItem('priceAlerts', JSON.stringify(newAlerts));
    };

    const removeAlert = (cryptoId) => {
        const newAlerts = { ...alerts };
        delete newAlerts[cryptoId];
        setAlerts(newAlerts);
        localStorage.setItem('priceAlerts', JSON.stringify(newAlerts));
    };

    const clearNotification = () => {
        setNotification(null);
    };

    const value = {
        alerts,
        notification,
        addAlert,
        removeAlert,
        clearNotification
    };

    return (
        <AlertContext.Provider value={value}>
            {children}
        </AlertContext.Provider>
    );
}
