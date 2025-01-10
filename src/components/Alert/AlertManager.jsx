import React, { useState, useRef, useEffect } from 'react';
import { useAlert } from '../../contexts/AlertContext';
import { Bell, Trash2 } from 'lucide-react';

const AlertManager = () => {
    const { alerts, removeAlert } = useAlert();
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const handleClick = (e) => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const menuWidth = 320; 
            const menuHeight = 400; 

            let top = rect.top;
            let right = window.innerWidth - rect.right;

            if (right + menuWidth > window.innerWidth) {
                right = window.innerWidth - menuWidth - 35; 
            }

            if (top + menuHeight > window.innerHeight) {
                top = window.innerHeight - menuHeight +20; 
            }

            top = Math.max(20, top); 

            setMenuPosition({ top, right });
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target) &&
                menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (Object.keys(alerts).length === 0) return null;

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={handleClick}
                className="flex mb-6 items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors relative"
            >
                <Bell size={20} />
                {Object.keys(alerts).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {Object.keys(alerts).length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div 
                    ref={menuRef}
                    className="fixed bg-zinc-900 rounded-lg shadow-xl p-4 w-80 border border-yellow-500/50 z-50 max-h-[80vh] overflow-y-auto"
                    style={{
                        top: `${menuPosition.top}px`,
                        right: `${menuPosition.right}px`
                    }}
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Alertes de prix actives</h3>
                    {Object.keys(alerts).length === 0 ? (
                        <p className="text-gray-400 text-sm">Aucune alerte active</p>
                    ) : (
                        <div className="space-y-3">
                            {Object.entries(alerts).map(([cryptoId, alert]) => (
                                <div key={cryptoId} className="bg-black/50 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-yellow-500 font-medium">
                                            {alert.name} ({alert.symbol.toUpperCase()})
                                        </span>
                                        <button
                                            onClick={() => removeAlert(cryptoId)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-300 mt-1">
                                        <p>Prix actuel: ${alert.currentPrice}</p>
                                        <p>
                                            Alerte quand {alert.alertType === 'above' ? 'supérieur' : 'inférieur'} à: ${alert.targetPrice}
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <button
                                            onClick={() => {
                                                const testPrice = alert.alertType === 'above' 
                                                    ? parseFloat(alert.targetPrice) + 1 
                                                    : parseFloat(alert.targetPrice) - 1;
                                                
                                                const mockResponse = {
                                                    [cryptoId]: {
                                                        usd: testPrice
                                                    }
                                                };

                                                const event = new CustomEvent('priceUpdate', {
                                                    detail: {
                                                        cryptoId,
                                                        data: { ...mockResponse }
                                                    }
                                                });
                                                window.dispatchEvent(event);
                                            }}
                                            className="w-full mt-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-500 text-sm py-1 px-2 rounded transition-colors"
                                        >
                                            Simuler le déclenchement
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AlertManager;
