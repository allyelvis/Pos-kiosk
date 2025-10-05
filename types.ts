// FIX: Removed self-import of types which was causing declaration conflicts.

export interface Category {
  id: string;
  name:string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  sku: string;
  stock: number;
  imageUrl: string;
}

export interface OrderItem extends Product {
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  loyaltyPoints: number;
  isTaxExempt: boolean;
}

export interface CompletedOrder {
  id: string;
  items: OrderItem[];
  customer: Customer | null;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  timestamp: string;
  status: 'completed' | 'canceled';
}