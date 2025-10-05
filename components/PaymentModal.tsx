
import React from 'react';
import { XIcon } from './icons';

interface PaymentModalProps {
    total: number;
    onCompletePayment: (paymentMethod: string) => void;
    onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ total, onCompletePayment, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">Payment</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon className="w-6 h-6" /></button>
                </header>
                
                <div className="p-6 text-center">
                    <p className="text-gray-400 text-lg">Total Due</p>
                    <p className="text-5xl font-bold my-4">${total.toFixed(2)}</p>
                </div>
                
                <div className="p-6 grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => onCompletePayment('Cash')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-lg text-lg transition-colors"
                    >
                        Cash
                    </button>
                    <button 
                        onClick={() => onCompletePayment('Card')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-lg text-lg transition-colors"
                    >
                        Card
                    </button>
                     <button 
                        onClick={() => onCompletePayment('Mobile Money')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 rounded-lg text-lg transition-colors col-span-2"
                    >
                        Mobile Money
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
