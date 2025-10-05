import React, { useState, useMemo } from 'react';
import type { CompletedOrder, OrderItem } from '../types';
import { XIcon, PencilIcon, ArrowUturnLeftIcon, TrashIcon, UsersIcon, ScissorsIcon, PlusIcon, MinusIcon } from './icons';

interface OrderDetailsModalProps {
    order: CompletedOrder;
    onClose: () => void;
    onCancelOrder: (orderId: string) => void;
    onDeleteOrder: (orderId: string) => void;
    onEditOrder: (order: CompletedOrder) => void;
    onTransferCustomer: () => void;
    onSplitOrder: (originalOrder: CompletedOrder, itemsToSplit: OrderItem[]) => void;
}

const OrderSplitter: React.FC<{ order: CompletedOrder; onSplit: (items: OrderItem[]) => void; onClose: () => void; }> = ({ order, onSplit, onClose }) => {
    const [splitQuantities, setSplitQuantities] = useState<Record<string, number>>({});

    const handleQuantityChange = (itemId: string, currentQty: number, delta: number) => {
        setSplitQuantities(prev => {
            const newQty = (prev[itemId] || 0) + delta;
            if (newQty < 0 || newQty > currentQty) return prev;
            return { ...prev, [itemId]: newQty };
        });
    };

    const itemsToSplit = useMemo(() => {
        return Object.entries(splitQuantities)
            .filter(([, qty]) => qty > 0)
            .map(([itemId, quantity]) => {
                const originalItem = order.items.find(i => i.id === itemId)!;
                return { ...originalItem, quantity };
            });
    }, [splitQuantities, order.items]);

    const canSplit = itemsToSplit.length > 0;

    const handleConfirmSplit = () => {
        if (canSplit) {
            onSplit(itemsToSplit);
            onClose();
        }
    };

    return (
        <div className="bg-gray-900 p-4 rounded-lg mt-4">
            <h4 className="font-bold mb-2">Split Items to a New Order</h4>
            <p className="text-xs text-gray-400 mb-4">Select quantities to move to a new transaction. The original order will be updated.</p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                        <span className="truncate text-sm">{item.name} ({item.quantity})</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleQuantityChange(item.id, item.quantity, -1)} className="p-1 rounded-full bg-gray-600 hover:bg-gray-500"><MinusIcon className="w-4 h-4"/></button>
                            <span className="w-8 text-center font-bold">{splitQuantities[item.id] || 0}</span>
                            <button onClick={() => handleQuantityChange(item.id, item.quantity, 1)} className="p-1 rounded-full bg-gray-600 hover:bg-gray-500"><PlusIcon className="w-4 h-4"/></button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-sm">Cancel</button>
                <button onClick={handleConfirmSplit} disabled={!canSplit} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm disabled:bg-gray-500 disabled:cursor-not-allowed">
                    Create New Order with {itemsToSplit.reduce((sum, i) => sum + i.quantity, 0)} items
                </button>
            </div>
        </div>
    );
};


const OrderDetailsModal: React.FC<OrderDetailsModalProps> = (props) => {
    const { order, onClose, onCancelOrder, onDeleteOrder, onEditOrder, onTransferCustomer, onSplitOrder } = props;
    const [isSplitting, setIsSplitting] = useState(false);

    const isCompleted = order.status === 'completed';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
                <header className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold">Order Details</h2>
                        <p className="text-sm text-gray-400">{order.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon className="w-6 h-6" /></button>
                </header>

                <div className="flex-grow p-6 grid grid-cols-3 gap-6 overflow-y-auto">
                    {/* Items List */}
                    <div className="col-span-2">
                        <h3 className="font-bold mb-2 text-lg">Items</h3>
                        <div className="space-y-2">
                            {order.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm p-2 bg-gray-700 rounded-md">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-gray-400">{item.quantity} x ${item.price.toFixed(2)}</p>
                                    </div>
                                    <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                         {isSplitting && <OrderSplitter order={order} onSplit={(items) => onSplitOrder(order, items)} onClose={() => setIsSplitting(false)} />}
                    </div>

                    {/* Summary & Actions */}
                    <div className="col-span-1">
                        <div className="bg-gray-900 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                               <h3 className="font-bold text-lg">Summary</h3>
                               <span className={`text-xs font-bold px-2 py-0.5 rounded ${isCompleted ? 'bg-green-600' : 'bg-red-600'}`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="space-y-1 text-sm border-b border-gray-700 pb-3 mb-3">
                                <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Tax</span><span>${order.tax.toFixed(2)}</span></div>
                                <div className="flex justify-between font-bold text-lg"><span className="text-white">Total</span><span>${order.total.toFixed(2)}</span></div>
                            </div>
                            
                             <div className="space-y-1 text-sm">
                                <p className="text-gray-400">Customer: <span className="text-white font-semibold">{order.customer?.name || 'Guest'}</span></p>
                                <p className="text-gray-400">Paid with: <span className="text-white font-semibold">{order.paymentMethod}</span></p>
                                <p className="text-gray-400">Date: <span className="text-white font-semibold">{new Date(order.timestamp).toLocaleString()}</span></p>
                            </div>
                        </div>
                        
                        {isCompleted && (
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <button onClick={() => onEditOrder(order)} className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 rounded text-sm"><PencilIcon className="w-4 h-4" /> Edit</button>
                                <button onClick={() => onCancelOrder(order.id)} className="flex items-center justify-center gap-2 p-3 bg-yellow-600 hover:bg-yellow-700 text-black rounded text-sm"><ArrowUturnLeftIcon className="w-4 h-4" /> Void Sale</button>
                                <button onClick={onTransferCustomer} className="flex items-center justify-center gap-2 p-3 bg-gray-600 hover:bg-gray-500 rounded text-sm"><UsersIcon className="w-4 h-4" /> Transfer</button>
                                <button onClick={() => setIsSplitting(s => !s)} className={`flex items-center justify-center gap-2 p-3 rounded text-sm ${isSplitting ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'}`}><ScissorsIcon className="w-4 h-4" /> {isSplitting ? 'Cancel Split' : 'Split'}</button>
                            </div>
                        )}
                        <button onClick={() => onDeleteOrder(order.id)} className="w-full mt-2 flex items-center justify-center gap-2 p-3 bg-red-800 hover:bg-red-700 rounded text-sm"><TrashIcon className="w-4 h-4" /> Delete Record</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;