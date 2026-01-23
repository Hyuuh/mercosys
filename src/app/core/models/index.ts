export interface Customer {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName?: string; // Hydrated for UI
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName?: string; // Hydrated for UI
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  placedAt: string;
  expiresAt?: string;
  items?: OrderItem[];
}
