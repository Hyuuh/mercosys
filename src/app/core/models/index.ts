export interface Customer {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  productName?: string; // Hydrated for UI
}

export interface Order {
  id: string;
  customer_id: string;
  customerName?: string; // Hydrated for UI
  total_price: number;
  status: 'pending' | 'completed' | 'cancelled';
  placed_at: string;
  expires_at?: string;
  order_items?: OrderItem[];
}
