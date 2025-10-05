import React, { useState, useEffect } from 'react';
import type { OrderItem, Customer } from '../types';
// FIX: Corrected icon import path
import { PlusIcon, MinusIcon, TrashIcon, UserIcon, CreditCardIcon } from './icons';

interface OrderSummaryProps {
    items: OrderItem[];
    customer: Customer | null;
    subtotal: number;
    tax: number;
    total: number;
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onClearCart: () => void;
    onAddCustomer: () => void;
    onCheckout: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(navigator.language || 'en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

// Sub-component for each item in the order list for better state management
const OrderItemRow: React.FC<{
    item: OrderItem;
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
}> = ({ item, onUpdateQuantity }) => {
    const [inputValue, setInputValue] = useState(item.quantity.toString());

    useEffect(() => {
        // Syncs the input value if the parent's quantity value changes.
        // This handles cases where the quantity is capped by stock or updated elsewhere.
        setInputValue(item.quantity.toString());
    }, [item.quantity]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only digits and empty string for fluid editing
        if (/^\d*$/.test(value)) {
            setInputValue(value);
        }
    };

    const handleInputBlur = () => {
        const parsedQuantity = parseInt(inputValue, 10);
        // If the input is empty/invalid (NaN) or zero, remove the item by setting quantity to 0.
        // Otherwise, update with the parsed quantity. The parent component will handle stock limits.
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            onUpdateQuantity(item.id, 0);
        } else {
            onUpdateQuantity(item.id, parsedQuantity);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
    };

    return (
        <div className="flex items-center justify-between mb-3 bg-gray-700 p-2 rounded-md">
            <div className="flex-grow w-0"> {/* Add w-0 to help truncation */}
                <p className="font-semibold truncate" title={item.name}>{item.name}</p>
                <p className="text-sm text-gray-400">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} 
                    className="p-1 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors"
                    aria-label={`Decrease quantity of ${item.name}`}
                >
                    <MinusIcon className="w-4 h-4"/>
                </button>
                <input
                    type="text"
                    inputMode="numeric"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyPress={handleKeyPress}
                    className="w-12 bg-gray-900 text-center font-medium rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Quantity for ${item.name}`}
                />
                <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} 
                    className="p-1 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.quantity >= item.stock} 
                    aria-label={`Increase quantity of ${item.name}`}
                >
                    <PlusIcon className="w-4 h-4"/>
                </button>
            </div>
            <p className="w-20 text-right font-semibold flex-shrink-0">{formatCurrency(item.price * item.quantity)}</p>
        </div>
    );
};


const OrderSummary: React.FC<OrderSummaryProps> = ({
    items, customer, subtotal, tax, total, onUpdateQuantity, onClearCart, onAddCustomer, onCheckout
}) => {
    return (
        <div className="h-full flex flex-col p-4 text-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Current Order</h2>
                <button onClick={onClearCart} className="text-red-400 hover:text-red-300 transition-colors" aria-label="Clear cart">
                    <TrashIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg mb-4">
                 {customer ? (
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold">{customer.name}</p>
                            {customer.isTaxExempt && (
                                <span className="text-xs font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                    TAX EXEMPT
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-400">{customer.email}</p>
                    </div>
                ) : (
                    <p className="text-gray-400">No customer selected</p>
                )}
                <button onClick={onAddCustomer} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm transition-colors">
                    <UserIcon className="w-4 h-4" />
                    {customer ? 'Change' : 'Add'} Customer
                </button>
            </div>

            <div className="flex-grow overflow-y-auto -mr-2 pr-2">
                {items.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        <p>Click on products to add them to the order.</p>
                    </div>
                ) : (
                    items.map(item => (
                       <OrderItemRow key={item.id} item={item} onUpdateQuantity={onUpdateQuantity} />
                    ))
                )}
            </div>
            <div className="flex-shrink-0 pt-4 border-t border-gray-700">
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Tax {customer?.isTaxExempt && '(Exempt)'}</span>
                        <span>{formatCurrency(tax)}</span>
                    </div>
                </div>
                <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-gray-600">
                    <span className="text-2xl font-bold">Total</span>
                    <span className="text-3xl font-bold">{formatCurrency(total)}</span>
                </div>
                <button 
                    onClick={onCheckout}
                    disabled={items.length === 0}
                    className="w-full mt-4 bg-green-600 text-white font-bold py-4 rounded-lg text-lg flex items-center justify-center gap-2 transition-colors hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed">
                    <CreditCardIcon className="w-6 h-6" />
                    Pay
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;