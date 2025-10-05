import React, { useState, useMemo } from 'react';
import type { CompletedOrder } from '../types';
import { XIcon, SearchIcon } from './icons';

interface OrderHistoryModalProps {
    orders: CompletedOrder[];
    onSelectOrder: (order: CompletedOrder) => void;
    onClose: () => void;
}

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ orders, onSelectOrder, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const term = searchTerm.toLowerCase();
            const customerName = o.customer?.name.toLowerCase() || '';
            const orderId = o.id.toLowerCase();
            return customerName.includes(term) || orderId.includes(term);
        });
    }, [orders, searchTerm]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold">Order History</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon className="w-6 h-6" /></button>
                </header>

                <div className="p-4 flex-shrink-0">
                    <div className="relative">
                        <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                
                <div className="p-4 pt-0 overflow-y-auto">
                    <div className="space-y-2">
                        {filteredOrders.length > 0 ? filteredOrders.map(order => (
                            <div 
                                key={order.id} 
                                onClick={() => onSelectOrder(order)}
                                className="grid grid-cols-4 items-center gap-4 p-3 bg-gray-700 hover:bg-blue-600 rounded-md cursor-pointer transition-colors"
                            >
                                <div>
                                    <p className="font-semibold text-sm truncate">{order.id}</p>
                                    <p className="text-xs text-gray-400">{new Date(order.timestamp).toLocaleString()}</p>
                                </div>
                                <div className="truncate">
                                    <p className="font-semibold text-sm">{order.customer?.name || 'Guest'}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${order.status === 'completed' ? 'bg-green-600' : 'bg-red-600'}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-gray-500">
                                No orders found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryModal;