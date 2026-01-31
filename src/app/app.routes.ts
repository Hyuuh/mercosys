import { Routes } from '@angular/router';
import { LayoutComponent } from './ui/layout/layout.component';
import { OrderListComponent } from './features/orders/order-list.component';
import { OrderFormComponent } from './features/orders/order-form.component';
import { CustomerListComponent } from './features/customers/customer-list.component';
import { CustomerFormComponent } from './features/customers/customer-form.component';
import { ProductListComponent } from './features/products/product-list.component';
import { ProductFormComponent } from './features/products/product-form.component';
import { LoginComponent } from './features/auth/login.component';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/dashboard/home.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent },

      // Orders
      { path: 'orders', component: OrderListComponent },
      { path: 'orders/new', component: OrderFormComponent },
      { path: 'orders/:id', component: OrderFormComponent },

      // Customers
      { path: 'customers', component: CustomerListComponent },
      { path: 'customers/new', component: CustomerFormComponent },
      { path: 'customers/:id/edit', component: CustomerFormComponent },

      // Products
      { path: 'products', component: ProductListComponent },
      { path: 'products/new', component: ProductFormComponent },
      { path: 'products/:id/edit', component: ProductFormComponent },
    ],
  },
];
