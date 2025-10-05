import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock < 10;

    return (
        <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`bg-gray-700 rounded-lg overflow-hidden text-center shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isOutOfStock && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white font-bold text-lg rotate-[-15deg] border-2 border-red-500 px-4 py-1 rounded">OUT OF STOCK</span>
                </div>
            )}
            {isLowStock && (
                <div className="absolute top-1 right-1 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-0.5 rounded">
                    LOW STOCK
                </div>
            )}
            <img src={product.imageUrl} alt={product.name} className="w-full h-28 object-cover"/>
            <div className="p-2">
                <h3 className="text-sm font-semibold text-white truncate">{product.name}</h3>
                <p className="text-xs text-gray-400">
                    ${product.price.toFixed(2)}
                </p>
                 <p className={`text-xs ${isLowStock ? 'text-yellow-400 font-semibold' : 'text-gray-500'}`}>
                    {product.stock} in stock
                </p>
            </div>
        </button>
    );
};

export default ProductCard;