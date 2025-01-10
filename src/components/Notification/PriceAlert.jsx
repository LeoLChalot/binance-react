import React, { useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useAlert } from '../../contexts/AlertContext';

const PriceAlert = () => {
    const { notification, clearNotification } = useAlert();

    useEffect(() => {
        if (notification) {
            const timeout = setTimeout(clearNotification, 10000);
            return () => clearTimeout(timeout);
        }
    }, [notification, clearNotification]);

    if (!notification) return null;

    return (
        <div className="fixed bottom-4 right-4 max-w-sm w-full bg-zinc-900 rounded-lg shadow-lg p-4 border border-yellow-500/50 animate-slide-up">
            <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-white">{notification.message}</p>
                    <p className="text-sm text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                    </p>
                </div>
                <button
                    onClick={clearNotification}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default PriceAlert;
