import React, { useState, useMemo } from 'react';
import type { Product, Category } from '../types';
import { XIcon, SearchIcon, PencilIcon, TrashIcon, PlusIcon } from './icons';
import ProductEditModal from './ProductEditModal';

interface StoreManagementModalProps {
    products: Product[];
    categories: Category[];
    onAddOrUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: string) => void;
    onAddOrUpdateCategory: (category: Category) => void;
    onDeleteCategory: (categoryId: string) => void;
    onClose: () => void;
}

const StoreManagementModal: React.FC<StoreManagementModalProps> = (props) => {
    const { products, categories, onAddOrUpdateProduct, onDeleteProduct, onAddOrUpdateCategory, onDeleteCategory, onClose } = props;
    const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
    
    // Product states
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    // Category states
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');

    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(productSearchTerm.toLowerCase()));
    }, [products, productSearchTerm]);
    
    const handleEditProduct = (product: Product) => {
        setProductToEdit(product);
        setIsProductModalOpen(true);
    };

    const handleAddNewProduct = () => {
        setProductToEdit(null);
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = (productData: Product) => {
        onAddOrUpdateProduct(productData);
        setIsProductModalOpen(false);
    };
    
    const handleConfirmDeleteProduct = (product: Product) => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
            onDeleteProduct(product.id);
        }
    };

    const handleAddNewCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            onAddOrUpdateCategory({ id: `cat-${Date.now()}`, name: newCategoryName.trim() });
            setNewCategoryName('');
        }
    };
    
    const handleSaveCategoryEdit = (categoryId: string) => {
        if (editingCategoryName.trim()) {
            onAddOrUpdateCategory({ id: categoryId, name: editingCategoryName.trim() });
            setEditingCategoryId(null);
            setEditingCategoryName('');
        }
    };
    
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
                    <header className="flex items-center justify-between p-4 border-b border-gray-700">
                        <h2 className="text-xl font-bold">Store Management</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon className="w-6 h-6" /></button>
                    </header>

                    <div className="flex-shrink-0 p-2 bg-gray-900 border-b border-gray-700">
                        <nav className="flex space-x-2">
                            <button onClick={() => setActiveTab('products')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'products' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Products</button>
                            <button onClick={() => setActiveTab('categories')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'categories' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Categories</button>
                        </nav>
                    </div>

                    <div className="p-4 overflow-y-auto">
                        {activeTab === 'products' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="relative w-full max-w-xs">
                                        <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input type="text" placeholder="Search products..." value={productSearchTerm} onChange={e => setProductSearchTerm(e.target.value)} className="w-full bg-gray-900 border-gray-700 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                    </div>
                                    <button onClick={handleAddNewProduct} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm transition-colors"><PlusIcon className="w-5 h-5"/>Add New Product</button>
                                </div>
                                <div className="space-y-2">
                                    {filteredProducts.map(p => (
                                        <div key={p.id} className="grid grid-cols-6 gap-4 items-center p-2 bg-gray-700 rounded-md">
                                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded"/>
                                            <span className="font-semibold col-span-2 truncate">{p.name}</span>
                                            <span className="text-gray-400">${p.price.toFixed(2)}</span>
                                            <span className="text-gray-400">{p.stock} in stock</span>
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEditProduct(p)} className="p-2 text-gray-300 hover:text-white"><PencilIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleConfirmDeleteProduct(p)} className="p-2 text-red-400 hover:text-red-300"><TrashIcon className="w-5 h-5"/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'categories' && (
                             <div>
                                <form onSubmit={handleAddNewCategory} className="flex items-center gap-2 mb-4">
                                    <input type="text" placeholder="New category name..." value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="flex-grow bg-gray-900 border-gray-700 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                    <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm transition-colors"><PlusIcon className="w-5 h-5"/>Add</button>
                                </form>
                                <div className="space-y-2">
                                    {categories.filter(c => c.id !== 'all').map(c => (
                                        <div key={c.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-md">
                                            {editingCategoryId === c.id ? (
                                                <input type="text" value={editingCategoryName} onChange={e => setEditingCategoryName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveCategoryEdit(c.id)} onBlur={() => handleSaveCategoryEdit(c.id)} autoFocus className="bg-gray-900 border-gray-600 rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                                            ) : (
                                                <span className="font-semibold">{c.name}</span>
                                            )}
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingCategoryId(c.id); setEditingCategoryName(c.name); }} className="p-2 text-gray-300 hover:text-white"><PencilIcon className="w-5 h-5"/></button>
                                                <button onClick={() => onDeleteCategory(c.id)} className="p-2 text-red-400 hover:text-red-300"><TrashIcon className="w-5 h-5"/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        )}
                    </div>
                </div>
            </div>
            {isProductModalOpen && (
                <ProductEditModal
                    product={productToEdit}
                    categories={categories}
                    onSave={handleSaveProduct}
                    onClose={() => setIsProductModalOpen(false)}
                />
            )}
        </>
    );
};

export default StoreManagementModal;
