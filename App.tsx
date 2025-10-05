import React, { useState, useMemo } from 'react';

// Import types
import type { Product, Category, Customer, OrderItem, CompletedOrder } from './types';

// Import data constants
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES, CUSTOMERS as INITIAL_CUSTOMERS, TAX_RATE } from './constants';

// Import components
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import ProductGrid from './components/ProductGrid';
import OrderSummary from './components/OrderSummary';
import CustomerModal from './components/CustomerModal';
import PaymentModal from './components/PaymentModal';
import ReceiptModal from './components/ReceiptModal';
import OrderHistoryModal from './components/OrderHistoryModal';
import OrderDetailsModal from './components/OrderDetailsModal';
import StoreManagementModal from './components/StoreManagementModal';
import DashboardModal from './components/DashboardModal';

type ModalType = 'customer' | 'payment' | 'receipt' | 'history' | 'details' | 'dashboard' | 'store' | null;

const App: React.FC = () => {
    // Data state
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
    const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);

    // Current order state
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
    const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

    // UI State
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<CompletedOrder | null>(null);
    
    // Derived state for current order
    const subtotal = useMemo(() => orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [orderItems]);
    const tax = useMemo(() => {
        if (currentCustomer?.isTaxExempt) {
            return 0;
        }
        return subtotal * TAX_RATE;
    }, [subtotal, currentCustomer]);
    const total = useMemo(() => subtotal + tax, [subtotal, tax]);

    const filteredProducts = useMemo(() => {
        if (activeCategoryId === 'all') return products;
        return products.filter(p => p.categoryId === activeCategoryId);
    }, [products, activeCategoryId]);

    // Handlers
    const handleAddToCart = (product: Product) => {
        setOrderItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                const newQuantity = Math.min(product.stock, existingItem.quantity + 1);
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: newQuantity } : item
                );
            }
            if (product.stock > 0) {
              return [...prevItems, { ...product, quantity: 1 }];
            }
            return prevItems;
        });
    };

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            setOrderItems(prev => prev.filter(item => item.id !== productId));
            return;
        }

        setOrderItems(prev => prev.map(item => {
            if (item.id === productId) {
                const cappedQuantity = Math.min(item.stock, newQuantity);
                return { ...item, quantity: cappedQuantity };
            }
            return item;
        }));
    };

    const handleClearCart = () => {
        setOrderItems([]);
        setCurrentCustomer(null);
    };
    
    const handleSelectCustomer = (customer: Customer) => {
        setCurrentCustomer(customer);
        setActiveModal(null);
    };

    const handleCompletePayment = (paymentMethod: string) => {
        const newOrder: CompletedOrder = {
            id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            items: orderItems,
            customer: currentCustomer,
            subtotal,
            tax,
            total,
            paymentMethod,
            timestamp: new Date().toISOString(),
            status: 'completed',
        };

        // Update product stock
        const updatedProducts = products.map(p => {
            const itemInOrder = orderItems.find(item => item.id === p.id);
            if (itemInOrder) {
                return { ...p, stock: p.stock - itemInOrder.quantity };
            }
            return p;
        });
        setProducts(updatedProducts);

        setCompletedOrders(prev => [newOrder, ...prev]);
        setSelectedOrderForDetails(newOrder); // To show receipt for this new order
        setActiveModal('receipt');
    };

    const handleNewSale = () => {
        handleClearCart();
        setActiveModal(null);
        setSelectedOrderForDetails(null);
    };
    
    const handleShowOrderDetails = (order: CompletedOrder) => {
        setSelectedOrderForDetails(order);
        setActiveModal('details');
    };

    const handleCancelOrder = (orderId: string) => {
        const orderToCancel = completedOrders.find(o => o.id === orderId);
        if (!orderToCancel || orderToCancel.status === 'canceled') return;

        setCompletedOrders(prevOrders => prevOrders.map(o => o.id === orderId ? {...o, status: 'canceled'} : o));

        // Return stock
        const updatedProducts = products.map(p => {
            const itemInOrder = orderToCancel.items.find(item => item.id === p.id);
            if (itemInOrder) {
                return { ...p, stock: p.stock + itemInOrder.quantity };
            }
            return p;
        });
        setProducts(updatedProducts);
        
        setActiveModal(null);
    };
    
    const handleDeleteOrder = (orderId: string) => {
        if (window.confirm("Are you sure you want to permanently delete this order record? This cannot be undone.")) {
            setCompletedOrders(prev => prev.filter(o => o.id !== orderId));
            setActiveModal(null);
        }
    };

    const handleEditOrder = (orderToEdit: CompletedOrder) => {
        // for simplicity, we'll just load it into the current order view
        setOrderItems(orderToEdit.items);
        setCurrentCustomer(orderToEdit.customer);
        // We'll also mark the original as canceled to avoid duplication
        handleCancelOrder(orderToEdit.id);
        setActiveModal(null);
    };

    const handleSplitOrder = (originalOrder: CompletedOrder, itemsToSplit: OrderItem[]) => {
        // Create new order
        const subtotalSplit = itemsToSplit.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const taxSplit = subtotalSplit * TAX_RATE;
        const totalSplit = subtotalSplit + taxSplit;
        const newSplitOrder: CompletedOrder = {
             id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
             items: itemsToSplit,
             customer: originalOrder.customer,
             subtotal: subtotalSplit,
             tax: taxSplit,
             total: totalSplit,
             paymentMethod: originalOrder.paymentMethod,
             timestamp: new Date().toISOString(),
             status: 'completed'
        };

        // Update original order
        const updatedOriginalOrderItems = originalOrder.items.map(item => {
            const splitItem = itemsToSplit.find(si => si.id === item.id);
            if(splitItem) {
                return { ...item, quantity: item.quantity - splitItem.quantity };
            }
            return item;
        }).filter(item => item.quantity > 0);
        
        const subtotalOrig = updatedOriginalOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const taxOrig = subtotalOrig * TAX_RATE;
        const totalOrig = subtotalOrig + taxOrig;

        const updatedOriginalOrder: CompletedOrder = {
            ...originalOrder,
            items: updatedOriginalOrderItems,
            subtotal: subtotalOrig,
            tax: taxOrig,
            total: totalOrig,
        };
        
        setCompletedOrders(prev => [newSplitOrder, ...prev.map(o => o.id === originalOrder.id ? updatedOriginalOrder : o)]);
        setSelectedOrderForDetails(newSplitOrder); // show details of newly created split order
    };

    const handleAddOrUpdateProduct = (product: Product) => {
        setProducts(prev => {
            const exists = prev.some(p => p.id === product.id);
            if(exists) {
                return prev.map(p => p.id === product.id ? product : p);
            }
            return [...prev, product];
        });
    };
    
    const handleDeleteProduct = (productId: string) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    const handleAddOrUpdateCategory = (category: Category) => {
        setCategories(prev => {
            const exists = prev.some(c => c.id === category.id);
            if (exists) {
                return prev.map(c => c.id === category.id ? category : c);
            }
            return [...prev, category];
        });
    };

    const handleDeleteCategory = (categoryId: string) => {
        if(products.some(p => p.categoryId === categoryId)) {
            alert("Cannot delete category as it is currently assigned to one or more products.");
            return;
        }
        setCategories(prev => prev.filter(c => c.id !== categoryId));
    };

    return (
        <div className="bg-gray-800 text-white h-screen flex flex-col font-sans">
            <Header
                onShowOrderHistory={() => setActiveModal('history')}
                onShowDashboard={() => setActiveModal('dashboard')}
                onShowStoreManagement={() => setActiveModal('store')}
            />
            <main className="flex-grow flex overflow-hidden">
                <div className="flex-grow flex flex-col">
                    <CategoryTabs
                        categories={categories}
                        activeCategoryId={activeCategoryId}
                        onSelectCategory={setActiveCategoryId}
                    />
                    <ProductGrid
                        products={filteredProducts}
                        onAddToCart={handleAddToCart}
                    />
                </div>
                <aside className="w-1/3 max-w-md bg-gray-900 flex-shrink-0 shadow-2xl">
                    <OrderSummary
                        items={orderItems}
                        customer={currentCustomer}
                        subtotal={subtotal}
                        tax={tax}
                        total={total}
                        onUpdateQuantity={handleUpdateQuantity}
                        onClearCart={handleClearCart}
                        onAddCustomer={() => setActiveModal('customer')}
                        onCheckout={() => setActiveModal('payment')}
                    />
                </aside>
            </main>

            {activeModal === 'customer' && (
                <CustomerModal
                    customers={customers}
                    onSelectCustomer={handleSelectCustomer}
                    onClose={() => setActiveModal(null)}
                />
            )}
            {activeModal === 'payment' && (
                <PaymentModal
                    total={total}
                    onCompletePayment={handleCompletePayment}
                    onClose={() => setActiveModal(null)}
                />
            )}
            {activeModal === 'receipt' && selectedOrderForDetails && (
                <ReceiptModal
                    order={selectedOrderForDetails}
                    onNewSale={handleNewSale}
                />
            )}
            {activeModal === 'history' && (
                <OrderHistoryModal
                    orders={completedOrders}
                    onSelectOrder={handleShowOrderDetails}
                    onClose={() => setActiveModal(null)}
                />
            )}
             {activeModal === 'details' && selectedOrderForDetails && (
                <OrderDetailsModal
                    order={selectedOrderForDetails}
                    onClose={() => setActiveModal(null)}
                    onCancelOrder={handleCancelOrder}
                    onDeleteOrder={handleDeleteOrder}
                    onEditOrder={handleEditOrder}
                    onTransferCustomer={() => { alert("Transfer customer feature not implemented."); }}
                    onSplitOrder={handleSplitOrder}
                />
            )}
            {activeModal === 'dashboard' && (
                <DashboardModal 
                    orders={completedOrders}
                    onClose={() => setActiveModal(null)}
                />
            )}
            {activeModal === 'store' && (
                <StoreManagementModal
                    products={products}
                    categories={categories}
                    onAddOrUpdateProduct={handleAddOrUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onAddOrUpdateCategory={handleAddOrUpdateCategory}
                    onDeleteCategory={handleDeleteCategory}
                    onClose={() => setActiveModal(null)}
                />
            )}
        </div>
    );
};

export default App;