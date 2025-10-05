import React, { useState, useEffect } from 'react';
import { SearchIcon, CloudIcon, ClipboardListIcon } from './icons';

const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return <div className="text-xl font-medium">{time.toLocaleTimeString()}</div>;
};

interface HeaderProps {
    searchTerm: string;
    onSearch: (term: string) => void;
    isOnline: boolean;
    onShowOrders: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearch, isOnline, onShowOrders }) => {
    return (
        <header className="flex items-center justify-between p-4 bg-gray-800 text-white shadow-md flex-shrink-0">
            <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <h1 className="text-2xl font-bold tracking-wider">Modular POS</h1>
            </div>

            <div className="flex-grow mx-8 max-w-lg">
                <div className="relative">
                    <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Search products"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                 <button onClick={onShowOrders} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-md hover:bg-gray-700">
                    <ClipboardListIcon className="w-6 h-6" />
                    <span className="text-sm font-medium">Orders</span>
                </button>
                <div className={`flex items-center gap-2 p-1 rounded ${isOnline ? 'text-green-400' : 'text-gray-500 animate-pulse'}`}>
                    <CloudIcon className="w-6 h-6" />
                    <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
                <Clock />
                <div className="flex items-center gap-2">
                     <span className="text-gray-400">Cashier: Jane Doe</span>
                     <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">JD</div>
                </div>
            </div>
        </header>
    );
};

export default Header;