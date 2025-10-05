import React from 'react';
import { ChartBarIcon, ClipboardListIcon, CogIcon } from './icons';

interface HeaderProps {
    onShowOrderHistory: () => void;
    onShowDashboard: () => void;
    onShowStoreManagement: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowOrderHistory, onShowDashboard, onShowStoreManagement }) => {
    return (
        <header className="flex-shrink-0 bg-gray-900 text-white shadow-md flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold tracking-wider">Modular POS</h1>
            <div className="flex items-center space-x-2">
                <button 
                    onClick={onShowOrderHistory}
                    className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm"
                    aria-label="View Order History"
                >
                    <ClipboardListIcon className="w-5 h-5" />
                    History
                </button>
                <button
                    onClick={onShowDashboard}
                    className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm"
                    aria-label="View Dashboard"
                >
                    <ChartBarIcon className="w-5 h-5" />
                    Dashboard
                </button>
                <button 
                    onClick={onShowStoreManagement}
                    className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm"
                    aria-label="Store Management"
                >
                    <CogIcon className="w-5 h-5" />
                    Manage
                </button>
            </div>
        </header>
    );
};

export default Header;
