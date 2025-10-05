
import React, { useState, useMemo } from 'react';
import type { Customer } from '../types';
import { XIcon, SearchIcon } from './icons';

interface CustomerModalProps {
    customers: Customer[];
    onSelectCustomer: (customer: Customer) => void;
    onClose: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ customers, onSelectCustomer, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = useMemo(() => {
        if (!searchTerm) return customers;
        return customers.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [customers, searchTerm]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">Select Customer</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon className="w-6 h-6" /></button>
                </header>

                <div className="p-4">
                    <div className="relative">
                        <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                
                <div className="p-4 pt-0 overflow-y-auto max-h-[60vh]">
                    <div className="space-y-2">
                        {filteredCustomers.map(customer => (
                            <div 
                                key={customer.id} 
                                onClick={() => onSelectCustomer(customer)}
                                className="flex justify-between items-center p-3 bg-gray-700 hover:bg-blue-600 rounded-md cursor-pointer transition-colors"
                            >
                                <div>
                                    <p className="font-semibold">{customer.name}</p>
                                    <p className="text-sm text-gray-400">{customer.email}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-yellow-400">{customer.loyaltyPoints} pts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerModal;
