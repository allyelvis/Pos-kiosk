
import React from 'react';
import type { Category } from '../types';

interface CategoryTabsProps {
    categories: Category[];
    activeCategoryId: string;
    onSelectCategory: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategoryId, onSelectCategory }) => {
    return (
        <div className="flex-shrink-0 p-2 bg-gray-900">
            <nav className="flex space-x-2 overflow-x-auto pb-2">
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex-shrink-0
                            ${activeCategoryId === category.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }
                        `}
                    >
                        {category.name}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default CategoryTabs;