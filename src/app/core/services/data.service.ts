import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Customer, Order, OrderItem, Product } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);
  // Assuming the server runs on port 3000
  private apiUrl = 'http://localhost:3000/api';

  // Signals for state
  private _customers = signal<Customer[]>([]);
  private _products = signal<Product[]>([]);
  private _orders = signal<Order[]>([]);

  // Public readonly signals
  customers = this._customers.asReadonly();
  products = this._products.asReadonly();

  // Hydrated orders with Customer names and Items
  orders = computed(() => {
    const custMap = new Map(this._customers().map((c) => [c.id, c.fullName]));
    return this._orders().map((o) => ({
      ...o,
      customerName: custMap.get(o.customerId) || 'Unknown',
    }));
  });

  constructor() {
    this.loadData();
  }

  private async loadData() {
    try {
      // Load all data in parallel
      const [customers, products, orders] = await Promise.all([
        firstValueFrom(this.http.get<Customer[]>(`${this.apiUrl}/customers`)),
        firstValueFrom(this.http.get<Product[]>(`${this.apiUrl}/products`)),
        firstValueFrom(this.http.get<Order[]>(`${this.apiUrl}/orders`)),
      ]);

      this._customers.set(customers);
      this._products.set(products);
      this._orders.set(orders);
    } catch (error) {
      console.error('Error loading data from API', error);
    }
  }

  // --- Customers ---
  async addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>) {
    try {
      const newCustomer = await firstValueFrom(
        this.http.post<Customer>(`${this.apiUrl}/customers`, customer),
      );
      this._customers.update((items) => [newCustomer, ...items]);
    } catch (e) {
      console.error('Failed to add customer', e);
    }
  }

  updateCustomer(id: string, data: Partial<Omit<Customer, 'id' | 'createdAt'>>) {
    // Placeholder for API UPDATE
    this._customers.update((items) =>
      items.map((item) => (item.id === id ? { ...item, ...data } : item)),
    );
  }

  deleteCustomer(id: string) {
    // Placeholder for API DELETE
    this._customers.update((items) => items.filter((item) => item.id !== id));
  }

  getCustomer(id: string): Customer | undefined {
    return this._customers().find((c) => c.id === id);
  }

  // --- Products ---
  async addProduct(product: Omit<Product, 'id' | 'createdAt'>) {
    try {
      const newProduct = await firstValueFrom(
        this.http.post<Product>(`${this.apiUrl}/products`, product),
      );
      this._products.update((items) => [newProduct, ...items]);
    } catch (e) {
      console.error('Failed to add product', e);
    }
  }

  updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>) {
    // Placeholder for API UPDATE
    this._products.update((items) =>
      items.map((item) => (item.id === id ? { ...item, ...data } : item)),
    );
  }

  deleteProduct(id: string) {
    // Placeholder for API DELETE
    this._products.update((items) => items.filter((item) => item.id !== id));
  }

  getProduct(id: string): Product | undefined {
    return this._products().find((p) => p.id === id);
  }

  // --- Orders ---
  async addOrder(
    order: Omit<Order, 'id' | 'placedAt'>,
    items: Omit<OrderItem, 'id' | 'orderId'>[],
  ) {
    try {
      const payload = { ...order, items };
      await firstValueFrom(this.http.post<Order>(`${this.apiUrl}/orders`, payload));
      // Refresh orders to get the full object with items and derived DB fields
      this.reloadOrders();
    } catch (e) {
      console.error('Failed to create order', e);
    }
  }

  async reloadOrders() {
    try {
      const orders = await firstValueFrom(this.http.get<Order[]>(`${this.apiUrl}/orders`));
      this._orders.set(orders);
    } catch (e) {
      console.error(e);
    }
  }

  async updateOrder(
    id: string,
    order: Partial<Omit<Order, 'id' | 'placedAt'>>,
    items: Omit<OrderItem, 'id' | 'orderId'>[],
  ) {
    try {
      const payload = { ...order, items };
      await firstValueFrom(this.http.put<Order>(`${this.apiUrl}/orders/${id}`, payload));
      this.reloadOrders();
    } catch (e) {
      console.error('Failed to update order', e);
    }
  }

  async deleteOrder(id: string) {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/orders/${id}`));
      this.reloadOrders();
    } catch (e) {
      console.error('Failed to delete order', e);
    }
  }

  getOrderItems(orderId: string): OrderItem[] {
    const order = this._orders().find((o) => o.id === orderId);
    return order?.items || [];
  }
}
