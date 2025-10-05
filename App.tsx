import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CATEGORIES, PRODUCTS as MOCK_PRODUCTS, TAX_RATE, CUSTOMERS } from './constants';
import type { Product, OrderItem, Customer, CompletedOrder, Category } from './types';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import ProductGrid from './components/ProductGrid';
import OrderSummary from './components/OrderSummary';
import CustomerModal from './components/CustomerModal';
import PaymentModal from './components/PaymentModal';
import ReceiptModal from './components/ReceiptModal';
import OrderHistoryModal from './components/OrderHistoryModal';
import OrderDetailsModal from './components/OrderDetailsModal';

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
    const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
    const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

    // --- Order Management State ---
    const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
    const [showOrderHistoryModal, setShowOrderHistoryModal] = useState<boolean>(false);
    const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<CompletedOrder | null>(null);
    const [isTransferCustomerFlow, setIsTransferCustomerFlow] = useState<boolean>(false);


    // --- Data Persistence and Offline Mode ---
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Load products
        const cachedProducts = localStorage.getItem('products');
        setProducts(cachedProducts ? JSON.parse(cachedProducts) : MOCK_PRODUCTS);
        if (!cachedProducts) {
             localStorage.setItem('products', JSON.stringify(MOCK_PRODUCTS));
        }

        // Load current order draft
        const cachedOrder = localStorage.getItem('currentOrder');
        if (cachedOrder) {
            const { items, customer } = JSON.parse(cachedOrder);
            setOrderItems(items || []);
            setSelectedCustomer(customer || null);
        }
        
        // Load completed orders history
        const cachedCompletedOrders = localStorage.getItem('completedOrders');
        if (cachedCompletedOrders) {
            setCompletedOrders(JSON.parse(cachedCompletedOrders));
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('currentOrder', JSON.stringify({ items: orderItems, customer: selectedCustomer }));
    }, [orderItems, selectedCustomer]);
    
    useEffect(() => {
        localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
    }, [completedOrders]);
    
    useEffect(() => {
        // Persist product changes (like stock updates)
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    const syncOfflineOrders = useCallback(async () => {
        const offlineQueue = JSON.parse(localStorage.getItem('offlineOrderQueue') || '[]');
        if (offlineQueue.length > 0) {
            console.log(`Syncing ${offlineQueue.length} offline orders...`);
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                console.log('Sync successful!', offlineQueue);
                setCompletedOrders(prev => [...offlineQueue, ...prev]);
                localStorage.removeItem('offlineOrderQueue');
            } catch (error) {
                console.error('Failed to sync offline orders:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (isOnline) {
            syncOfflineOrders();
        }
    }, [isOnline, syncOfflineOrders]);
    
    // --- Basic Handlers ---
    const handleSelectCategory = useCallback((categoryId: string) => setActiveCategoryId(categoryId), []);
    const handleSearch = useCallback((term: string) => setSearchTerm(term), []);
    const handleClearCart = useCallback(() => {
        setOrderItems([]);
        setSelectedCustomer(null);
    }, []);

    const handleAddToCart = useCallback((product: Product) => {
        setOrderItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                if (existingItem.quantity < product.stock) {
                    return prevItems.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return prevItems;
            }
            if (product.stock > 0) {
                return [...prevItems, { ...product, quantity: 1 }];
            }
            return prevItems;
        });
    }, []);

    const handleUpdateQuantity = useCallback((productId: string, newQuantity: number) => {
        setOrderItems(prevItems => {
            const productInCart = prevItems.find(item => item.id === productId);
            if (!productInCart) return prevItems;

            if (newQuantity <= 0) {
                return prevItems.filter(item => item.id !== productId);
            }
             if (newQuantity > productInCart.stock) {
                return prevItems.map(item =>
                    item.id === productId ? { ...item, quantity: productInCart.stock } : item
                );
            }
            return prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
        });
    }, []);

    const { subtotal, tax, total } = useMemo(() => {
        const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;
        return { subtotal, tax, total };
    }, [orderItems]);

    // --- Order Completion ---
    const handleCompletePayment = useCallback((paymentMethod: string) => {
        const order: CompletedOrder = {
            id: `ORD-${Date.now()}`,
            items: orderItems,
            customer: selectedCustomer,
            subtotal,
            tax,
            total,
            paymentMethod,
            timestamp: new Date().toISOString(),
            status: 'completed',
        };

        // Update stock levels
        setProducts(currentProducts => {
            const newProducts = [...currentProducts];
            order.items.forEach(item => {
                const productIndex = newProducts.findIndex(p => p.id === item.id);
                if (productIndex !== -1) {
                    newProducts[productIndex].stock -= item.quantity;
                }
            });
            return newProducts;
        });

        if (!isOnline) {
            const offlineQueue = JSON.parse(localStorage.getItem('offlineOrderQueue') || '[]');
            offlineQueue.push(order);
            localStorage.setItem('offlineOrderQueue', JSON.stringify(offlineQueue));
        } else {
            setCompletedOrders(prev => [order, ...prev]);
        }

        setCompletedOrder(order);
        setShowPaymentModal(false);
        setShowReceiptModal(true);
        handleClearCart();
        localStorage.removeItem('currentOrder');
    }, [orderItems, selectedCustomer, subtotal, tax, total, isOnline, handleClearCart]);

    const handleNewSale = useCallback(() => {
        setShowReceiptModal(false);
        setCompletedOrder(null);
    }, []);

    // --- Order Management Handlers ---
    const handleCancelOrder = useCallback((orderId: string) => {
        let orderToCancel: CompletedOrder | undefined;
        setCompletedOrders(prevOrders => prevOrders.map(o => {
            if (o.id === orderId && o.status === 'completed') {
                orderToCancel = o;
                return { ...o, status: 'canceled' };
            }
            return o;
        }));

        if (orderToCancel) {
            // Return stock
            setProducts(currentProducts => {
                const newProducts = [...currentProducts];
                orderToCancel!.items.forEach(item => {
                    const productIndex = newProducts.findIndex(p => p.id === item.id);
                    if (productIndex !== -1) {
                        newProducts[productIndex].stock += item.quantity;
                    }
                });
                return newProducts;
            });
        }
        setSelectedOrderForDetails(null);
    }, []);

    const handleDeleteOrder = useCallback((orderId: string) => {
        setCompletedOrders(prev => prev.filter(o => o.id !== orderId));
        setSelectedOrderForDetails(null);
    }, []);

    const handleEditOrder = useCallback((orderToEdit: CompletedOrder) => {
        handleCancelOrder(orderToEdit.id);
        setOrderItems(orderToEdit.items);
        setSelectedCustomer(orderToEdit.customer);
        setSelectedOrderForDetails(null);
        setShowOrderHistoryModal(false);
    }, [handleCancelOrder]);
    
    const handleTransferCustomerRequest = useCallback(() => {
        setIsTransferCustomerFlow(true);
        setShowCustomerModal(true);
    }, []);
    
    const handleSelectCustomer = useCallback((customer: Customer) => {
        if (isTransferCustomerFlow && selectedOrderForDetails) {
            setCompletedOrders(prevOrders =>
                prevOrders.map(o =>
                    o.id === selectedOrderForDetails.id ? { ...o, customer } : o
                )
            );
            setSelectedOrderForDetails(prev => prev ? { ...prev, customer } : null);
            setIsTransferCustomerFlow(false);
        } else {
            setSelectedCustomer(customer);
        }
        setShowCustomerModal(false);
    }, [isTransferCustomerFlow, selectedOrderForDetails]);
    
    const handleSplitOrder = useCallback((originalOrder: CompletedOrder, itemsToSplit: OrderItem[]) => {
        if (itemsToSplit.length === 0) return;

        const recalculateTotals = (items: OrderItem[]) => {
            const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const tax = subtotal * TAX_RATE;
            const total = subtotal + tax;
            return { subtotal, tax, total };
        };

        const newOrderTotals = recalculateTotals(itemsToSplit);
        const newOrder: CompletedOrder = {
            id: `ORD-${Date.now()}`,
            items: itemsToSplit,
            customer: originalOrder.customer,
            ...newOrderTotals,
            paymentMethod: 'Split',
            timestamp: new Date().toISOString(),
            status: 'completed',
        };

        const updatedOriginalItems = originalOrder.items.map(originalItem => {
            const splitItem = itemsToSplit.find(si => si.id === originalItem.id);
            if (splitItem) {
                return { ...originalItem, quantity: originalItem.quantity - splitItem.quantity };
            }
            return originalItem;
        }).filter(item => item.quantity > 0);

        const updatedOriginalTotals = recalculateTotals(updatedOriginalItems);
        const updatedOriginalOrder: CompletedOrder = {
            ...originalOrder,
            items: updatedOriginalItems,
            ...updatedOriginalTotals,
        };

        setCompletedOrders(prevOrders => {
            const otherOrders = prevOrders.filter(o => o.id !== originalOrder.id);
            return [newOrder, updatedOriginalOrder, ...otherOrders];
        });
        
        setSelectedOrderForDetails(updatedOriginalOrder);
    }, []);


    // --- Render ---
    const filteredProducts = useMemo(() => {
        return products.filter(p => 
            (activeCategoryId === 'all' || p.categoryId === activeCategoryId) &&
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeCategoryId, searchTerm, products]);

    return (
        <div className="h-screen w-screen bg-gray-900 flex flex-col font-sans overflow-hidden">
            <Header 
                searchTerm={searchTerm} 
                onSearch={handleSearch} 
                isOnline={isOnline}
                onShowOrders={() => setShowOrderHistoryModal(true)}
            />
            <div className="flex-grow flex p-4 gap-4 overflow-hidden">
                <main className="flex-[3] flex flex-col bg-gray-800 rounded-lg overflow-hidden">
                    <CategoryTabs categories={CATEGORIES} activeCategoryId={activeCategoryId} onSelectCategory={handleSelectCategory} />
                    <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
                </main>
                <aside className="flex-[2] bg-gray-800 rounded-lg flex flex-col">
                    <OrderSummary items={orderItems} customer={selectedCustomer} subtotal={subtotal} tax={tax} total={total} onUpdateQuantity={handleUpdateQuantity} onClearCart={handleClearCart} onAddCustomer={() => { setIsTransferCustomerFlow(false); setShowCustomerModal(true); }} onCheckout={() => setShowPaymentModal(true)} />
                </aside>
            </div>
            
            {/* --- Modals --- */}
            {showCustomerModal && (
                <CustomerModal customers={CUSTOMERS} onSelectCustomer={handleSelectCustomer} onClose={() => setShowCustomerModal(false)} />
            )}
            {showPaymentModal && (
                <PaymentModal total={total} onCompletePayment={handleCompletePayment} onClose={() => setShowPaymentModal(false)} />
            )}
            {showReceiptModal && completedOrder && (
                <ReceiptModal order={completedOrder} onNewSale={handleNewSale} />
            )}
            {showOrderHistoryModal && (
                <OrderHistoryModal 
                    orders={completedOrders}
                    onSelectOrder={(order) => setSelectedOrderForDetails(order)}
                    onClose={() => setShowOrderHistoryModal(false)}
                />
            )}
            {selectedOrderForDetails && (
                <OrderDetailsModal
                    order={selectedOrderForDetails}
                    onClose={() => setSelectedOrderForDetails(null)}
                    onCancelOrder={handleCancelOrder}
                    onDeleteOrder={handleDeleteOrder}
                    onEditOrder={handleEditOrder}
                    onTransferCustomer={handleTransferCustomerRequest}
                    onSplitOrder={handleSplitOrder}
                />
            )}
        </div>
    );
};

export default App;