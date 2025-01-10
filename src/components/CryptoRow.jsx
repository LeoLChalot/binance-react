import { CaseUpper } from "lucide-react";

export default function CryptoRow({ crypto, onClick }) {
    return (
        <tr className="border-b border-gray-200 hover:bg-gray-700" onClick={onClick}>
            <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex items-center">
                    <img className="h-8 w-8 rounded-full" src={crypto.image} alt="" />
                    <p>
                        <span className="font-bold text-xl ml-4">{crypto.symbol.toUpperCase()}</span>
                        <span className="font-medium text-gray-400 text-lg ml-4">{crypto.name}</span>
                    </p>
                </div>
            </td>
            <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex items-center">
                    <span>{crypto.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
            </td>
            <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex items-center">
                    <span>{crypto.market_cap.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
            </td>
            <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex items-center">
                    {
                        crypto.price_change_percentage_24h > 0
                            ? <span className="text-green-500">{crypto.price_change_percentage_24h.toFixed(2)}%</span>
                            : <span className="text-red-500">{crypto.price_change_percentage_24h.toFixed(2)}%</span>
                    }
                </div>
            </td>
            <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex items-center">
                    <span>{crypto.total_volume.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
            </td>
        </tr>
    );
}