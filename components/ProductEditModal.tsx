import React, { useState, useEffect } from 'react';
import type { Product, Category } from '../types';
import { XIcon, PhotoIcon } from './icons';

interface ProductEditModalProps {
    product: Product | null;
    categories: Category[];
    onSave: (product: Product) => void;
    onClose: () => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({ product, categories, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: '',
        categoryId: '',
        price: 0,
        sku: '',
        stock: 0,
        imageUrl: '',
        unit: 'each',
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                categoryId: product.categoryId,
                price: product.price,
                sku: product.sku,
                stock: product.stock,
                imageUrl: product.imageUrl,
                unit: product.unit || 'each',
            });
        } else {
            // Reset form for new product
            const defaultCategory = categories.find(c => c.id !== 'all');
            setFormData({
                name: '',
                categoryId: defaultCategory?.id || '',
                price: 0,
                sku: '',
                stock: 0,
                imageUrl: '',
                unit: 'each',
            });
        }
    }, [product, categories]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumericField = name === 'price' || name === 'stock';
        setFormData(prev => ({
            ...prev,
            [name]: isNumericField ? parseFloat(value) || 0 : value
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.categoryId || formData.price <= 0 || formData.stock < 0 || !formData.unit) {
            alert('Please fill in all required fields. Price must be > 0, Stock must be >= 0, and Unit cannot be empty.');
            return;
        }

        const productData: Product = {
            id: product?.id || `prod-${Date.now()}`,
            ...formData,
        };
        onSave(productData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon className="w-6 h-6" /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full bg-gray-900 border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <div>
                            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                            <select name="categoryId" id="categoryId" value={formData.categoryId} onChange={handleChange} required className="w-full bg-gray-900 border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="" disabled>Select a category</option>
                                {categories.filter(c => c.id !== 'all').map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                             <label htmlFor="sku" className="block text-sm font-medium text-gray-300 mb-1">SKU</label>
                            <input type="text" name="sku" id="sku" value={formData.sku} onChange={handleChange} className="w-full bg-gray-900 border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                         <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0.01" step="0.01" className="w-full bg-gray-900 border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <div>
                             <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-1">Stock Quantity</label>
                            <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required min="0" step="1" className="w-full bg-gray-900 border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-300 mb-1">Unit of Measurement</label>
                            <input type="text" name="unit" id="unit" value={formData.unit} onChange={handleChange} required placeholder="e.g., each, kg, bag" className="w-full bg-gray-900 border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Product Image</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" />
                                    <p className="text-sm text-gray-400">
                                        Image upload placeholder
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Feature coming soon. This can be integrated with an image generation service.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer className="p-4 bg-gray-900 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-md text-sm">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm">Save Product</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default ProductEditModal;