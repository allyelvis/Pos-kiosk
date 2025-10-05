import React from 'react';
import { XIcon } from './icons';
import type { CompletedOrder } from '../types';

interface DashboardModalProps {
    orders: CompletedOrder[];
    onClose: () => void;
}

const DashboardModal: React.FC<DashboardModalProps> = ({ orders, onClose }) => {
    // Basic analytics
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = completedOrders.length > 0 ? totalSales / completedOrders.length : 0;
    const itemsSold = completedOrders.flatMap(o => o.items).reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
                <header className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">Sales Dashboard</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-900 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-400">Total Revenue</p>
                        <p className="text-3xl font-bold">${totalSales.toFixed(2)}</p>
                    </div>
                     <div className="bg-gray-900 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-400">Completed Sales</p>
                        <p className="text-3xl font-bold">{completedOrders.length}</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-400">Avg. Order Value</p>
                        <p className="text-3xl font-bold">${averageOrderValue.toFixed(2)}</p>
                    </div>
                     <div className="bg-gray-900 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-400">Total Items Sold</p>
                        <p className="text-3xl font-bold">{itemsSold}</p>
                    </div>
                </div>
                <div className="p-6 pt-0 flex-grow overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-2">Recent Sales</h3>
                    <div className="space-y-2 pr-2">
                        {completedOrders.slice(0, 20).map(order => (
                             <div key={order.id} className="grid grid-cols-3 items-center gap-4 p-2 bg-gray-700 rounded-md text-sm">
                                 <div>
                                     <p className="font-semibold truncate">{order.id}</p>
                                     <p className="text-xs text-gray-400">{new Date(order.timestamp).toLocaleTimeString()}</p>
                                 </div>
                                 <div className="truncate">{order.customer?.name || 'Guest'}</div>
                                 <div className="text-right font-semibold">${order.total.toFixed(2)}</div>
                             </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardModal;
