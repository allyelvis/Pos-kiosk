import React from 'react';
import type { CompletedOrder } from '../types';

interface ReceiptModalProps {
    order: CompletedOrder;
    onNewSale: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(navigator.language || 'en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onNewSale }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-100 text-gray-900 rounded-lg shadow-xl w-full max-w-sm flex flex-col font-mono">
                <div className="p-6 text-center border-b border-gray-300">
                    <h2 className="text-2xl font-bold">SALE RECEIPT</h2>
                    <p className="text-sm">Modular Commerce Inc.</p>
                    <p className="text-xs">{new Date(order.timestamp).toLocaleString()}</p>
                </div>

                <div className="p-6 flex-grow overflow-y-auto max-h-[50vh]">
                    {order.customer && (
                        <div className="mb-4 pb-2 border-b border-dashed border-gray-400">
                            <p className="text-xs">CUSTOMER:</p>
                            <p className="text-sm font-semibold">{order.customer.name}</p>
                        </div>
                    )}

                    {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm mb-1">
                            <div className="flex-grow">
                                <p>{item.name}</p>
                                <p className="pl-2 text-xs text-gray-600">{item.quantity} @ {formatCurrency(item.price)} / {item.unit}</p>
                            </div>
                            <p className="flex-shrink-0">{formatCurrency(item.quantity * item.price)}</p>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-dashed border-gray-400 text-sm">
                    <div className="flex justify-between"><p>Subtotal:</p><p>{formatCurrency(order.subtotal)}</p></div>
                    <div className="flex justify-between"><p>Tax:</p><p>{formatCurrency(order.tax)}</p></div>
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-300"><p>Total:</p><p>{formatCurrency(order.total)}</p></div>
                    <div className="flex justify-between mt-1"><p>Paid by:</p><p>{order.paymentMethod}</p></div>
                </div>

                <div className="p-4">
                     <button
                        onClick={onNewSale}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg transition-colors hover:bg-blue-700"
                    >
                        New Sale
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;