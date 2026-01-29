import { Injectable, signal, computed, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Customer, Order, OrderItem, Product } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private supabase = inject(SupabaseService).client;

  private _customers = signal<Customer[]>([]);
  private _products = signal<Product[]>([]);
  private _orders = signal<Order[]>([]);

  customers = this._customers.asReadonly();
  products = this._products.asReadonly();

  orders = computed(() => {
    const custMap = new Map(this._customers().map((c) => [c.id, c.full_name]));
    return this._orders().map((o) => ({
      ...o,
      customerName: custMap.get(o.customer_id) || 'Unknown',
    }));
  });

  constructor() {
    this.loadData();
  }

  private async loadData() {
    try {
      const [customersRes, productsRes, ordersRes] = await Promise.all([
        this.supabase.from('customers').select('*'),
        this.supabase.from('products').select('*'),
        this.supabase.from('orders').select('*, order_items(*)'),
      ]);

      if (customersRes.error) throw customersRes.error;
      if (productsRes.error) throw productsRes.error;
      if (ordersRes.error) throw ordersRes.error;

      this._customers.set(customersRes.data || []);
      this._products.set(productsRes.data || []);
      this._orders.set(ordersRes.data || []);
    } catch (error) {
      console.error('Error loading data from Supabase', error);
    }
  }

  // --- Customers ---
  async addCustomer(customer: Omit<Customer, 'id' | 'created_at'>) {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .insert(customer)
        .select()
        .single();
      if (error) throw error;
      this._customers.update((items) => [data, ...items]);
    } catch (e) {
      console.error('Failed to add customer', e);
    }
  }

  async updateCustomer(id: string, data: Partial<Omit<Customer, 'id' | 'created_at'>>) {
    try {
      const { data: updated, error } = await this.supabase
        .from('customers')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      this._customers.update((items) => items.map((item) => (item.id === id ? updated : item)));
    } catch (e) {
      console.error('Failed to update customer', e);
    }
  }

  async deleteCustomer(id: string) {
    try {
      const { error } = await this.supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
      this._customers.update((items) => items.filter((item) => item.id !== id));
    } catch (e) {
      console.error('Failed to delete customer', e);
    }
  }

  getCustomer(id: string): Customer | undefined {
    return this._customers().find((c) => c.id === id);
  }

  // --- Products ---
  async addProduct(product: Omit<Product, 'id' | 'created_at'>) {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      if (error) throw error;
      this._products.update((items) => [data, ...items]);
    } catch (e) {
      console.error('Failed to add product', e);
    }
  }

  async updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'created_at'>>) {
    try {
      const { data: updated, error } = await this.supabase
        .from('products')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      this._products.update((items) => items.map((item) => (item.id === id ? updated : item)));
    } catch (e) {
      console.error('Failed to update product', e);
    }
  }

  async deleteProduct(id: string) {
    try {
      const { error } = await this.supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      this._products.update((items) => items.filter((item) => item.id !== id));
    } catch (e) {
      console.error('Failed to delete product', e);
    }
  }

  getProduct(id: string): Product | undefined {
    return this._products().find((p) => p.id === id);
  }

  // --- Orders ---
  async addOrder(
    order: Omit<Order, 'id' | 'placed_at'>,
    items: Omit<OrderItem, 'id' | 'order_id'>[],
  ) {
    try {
      const { data: newOrder, error: orderError } = await this.supabase
        .from('orders')
        .insert(order)
        .select()
        .single();
      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({ ...item, order_id: newOrder.id }));
      const { error: itemsError } = await this.supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      this.reloadOrders();
    } catch (e) {
      console.error('Failed to create order', e);
    }
  }

  async reloadOrders() {
    try {
      const { data, error } = await this.supabase.from('orders').select('*, order_items(*)');
      if (error) throw error;
      this._orders.set(data || []);
    } catch (e) {
      console.error(e);
    }
  }

  async updateOrder(
    id: string,
    order: Partial<Omit<Order, 'id' | 'placed_at'>>,
    items: Omit<OrderItem, 'id' | 'order_id'>[],
  ) {
    try {
      const { error: orderError } = await this.supabase.from('orders').update(order).eq('id', id);
      if (orderError) throw orderError;

      // Delete existing items and insert new ones
      await this.supabase.from('order_items').delete().eq('order_id', id);
      const orderItems = items.map((item) => ({ ...item, order_id: id }));
      const { error: itemsError } = await this.supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      this.reloadOrders();
    } catch (e) {
      console.error('Failed to update order', e);
    }
  }

  async deleteOrder(id: string) {
    try {
      const { error } = await this.supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      this.reloadOrders();
    } catch (e) {
      console.error('Failed to delete order', e);
    }
  }

  getOrderItems(orderId: string): OrderItem[] {
    const order = this._orders().find((o) => o.id === orderId);
    return order?.order_items || [];
  }
}
