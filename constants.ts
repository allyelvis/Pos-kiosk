
import { Category, Product, Customer } from './types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'snacks', name: 'Snacks' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'apparel', name: 'Apparel' },
];

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Espresso', categoryId: 'beverages', price: 3.50, sku: 'BEV-001', stock: 100, imageUrl: 'https://picsum.photos/id/225/200' },
  { id: 'p2', name: 'Latte', categoryId: 'beverages', price: 4.50, sku: 'BEV-002', stock: 80, imageUrl: 'https://picsum.photos/id/305/200' },
  { id: 'p3', name: 'Potato Chips', categoryId: 'snacks', price: 2.25, sku: 'SNK-001', stock: 150, imageUrl: 'https://picsum.photos/id/102/200' },
  { id: 'p4', name: 'Chocolate Bar', categoryId: 'snacks', price: 1.75, sku: 'SNK-002', stock: 200, imageUrl: 'https://picsum.photos/id/431/200' },
  { id: 'p5', name: 'Headphones', categoryId: 'electronics', price: 79.99, sku: 'ELE-001', stock: 30, imageUrl: 'https://picsum.photos/id/119/200' },
  { id: 'p6', name: 'USB-C Cable', categoryId: 'electronics', price: 12.00, sku: 'ELE-002', stock: 75, imageUrl: 'https://picsum.photos/id/512/200' },
  { id: 'p7', name: 'T-Shirt', categoryId: 'apparel', price: 25.00, sku: 'APP-001', stock: 50, imageUrl: 'https://picsum.photos/id/1080/200' },
  { id: 'p8', name: 'Beanie', categoryId: 'apparel', price: 18.50, sku: 'APP-002', stock: 40, imageUrl: 'https://picsum.photos/id/1078/200' },
  { id: 'p9', name: 'Sparkling Water', categoryId: 'beverages', price: 2.00, sku: 'BEV-003', stock: 120, imageUrl: 'https://picsum.photos/id/1015/200' },
  { id: 'p10', name: 'Granola Bar', categoryId: 'snacks', price: 1.50, sku: 'SNK-003', stock: 300, imageUrl: 'https://picsum.photos/id/292/200' },
  { id: 'p11', name: 'Mouse', categoryId: 'electronics', price: 45.00, sku: 'ELE-003', stock: 25, imageUrl: 'https://picsum.photos/id/0/200' },
  { id: 'p12', name: 'Hoodie', categoryId: 'apparel', price: 55.00, sku: 'APP-003', stock: 0, imageUrl: 'https://picsum.photos/id/1069/200' },
];

export const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Alice Johnson', email: 'alice@example.com', loyaltyPoints: 1250 },
  { id: 'c2', name: 'Bob Williams', email: 'bob@example.com', loyaltyPoints: 780 },
  { id: 'c3', name: 'Charlie Brown', email: 'charlie@example.com', loyaltyPoints: 2400 },
  { id: 'c4', name: 'Diana Prince', email: 'diana@example.com', loyaltyPoints: 500 },
];

export const TAX_RATE = 0.08; // 8%
