import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '@ui/components/badge.component';
import { SupabaseService } from '@core/services/supabase.service';
import { formatDate, getMonthName } from '@core/utils/date-formatter';
import { formatCurrency, formatNumber } from '@core/utils/number-formatter';

@Component({
  selector: 'app-home',
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Dashboard
          </h1>
          <p class="text-neutral-500 dark:text-neutral-400">
            Resumen de actividad y rendimiento de tu tienda.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <div
            class="px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-sm text-sm text-neutral-600 dark:text-neutral-300 capitalize"
          >
            {{ today }}
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (stat of stats(); track stat.label) {
          <div
            class="p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-neutral-500 dark:text-neutral-400">{{
                stat.label
              }}</span>
              <div
                class="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
              >
                <!-- Icon based on type -->
                @switch (stat.icon) {
                  @case ('currency') {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <line x1="12" x2="12" y1="2" y2="22" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  }
                  @case ('users') {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  }
                  @case ('shopping-cart') {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path
                        d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
                      />
                    </svg>
                  }
                  @case ('activity') {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  }
                }
              </div>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-neutral-900 dark:text-white">{{
                stat.value
              }}</span>
              <span
                class="text-xs font-medium px-1.5 py-0.5 rounded-full"
                [class.bg-green-100]="stat.trend > 0"
                [class.text-green-700]="stat.trend > 0"
                [class.bg-red-100]="stat.trend < 0"
                [class.text-red-700]="stat.trend < 0"
                [class.dark:bg-green-500/20]="stat.trend > 0"
                [class.dark:text-green-400]="stat.trend > 0"
                [class.dark:bg-red-500/20]="stat.trend < 0"
                [class.dark:text-red-400]="stat.trend < 0"
              >
                {{ stat.trend > 0 ? '+' : '' }}{{ formatNumber(stat.trend) }}%
              </span>
            </div>
            <p class="text-xs text-neutral-500 dark:text-neutral-500 mt-1">vs mes anterior</p>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <!-- Main Chart Section -->
        <div
          class="lg:col-span-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-semibold text-neutral-900 dark:text-white">Ingresos Generados</h3>
            <!-- Simple Custom Legend/Selector -->
            <div class="flex gap-2">
              <span
                class="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                <span class="w-2 h-2 rounded-full bg-blue-500"></span> Este año
              </span>
            </div>
          </div>

          <!-- CSS/SVG Chart Area -->
          <div class="relative h-75 w-full flex items-end justify-between gap-2 pt-6">
            <!-- Background Grid Lines -->
            <div
              class="absolute inset-0 flex flex-col justify-between text-xs text-neutral-400 dark:text-neutral-600 pointer-events-none pb-8 pr-4"
            >
              <div class="border-b border-neutral-100 dark:border-neutral-800 w-full h-0"></div>
              <div class="border-b border-neutral-100 dark:border-neutral-800 w-full h-0"></div>
              <div class="border-b border-neutral-100 dark:border-neutral-800 w-full h-0"></div>
              <div class="border-b border-neutral-100 dark:border-neutral-800 w-full h-0"></div>
              <div class="border-b border-neutral-100 dark:border-neutral-800 w-full h-0"></div>
            </div>

            <!-- Bars -->
            @for (item of chartData(); track item.month) {
              <div class="relative flex-1 flex flex-col items-center group h-full justify-end z-10">
                <!-- Tooltip -->
                <div
                  class="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20"
                >
                  {{ formatCurrency(item.value) }}
                </div>
                <!-- Bar -->
                <div
                  class="w-full max-w-8 bg-blue-500 dark:bg-blue-600 rounded-t-sm hover:bg-blue-400 dark:hover:bg-blue-500 transition-all duration-300"
                  [style.height.%]="(item.value / maxChartValue()) * 80"
                ></div>
                <!-- Label -->
                <span class="text-[10px] text-neutral-500 dark:text-neutral-400 mt-2">{{
                  item.month
                }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Recent Sales -->
        <div
          class="lg:col-span-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-0 overflow-hidden flex flex-col"
        >
          <div class="p-6 border-b border-neutral-100 dark:border-neutral-800">
            <h3 class="font-semibold text-neutral-900 dark:text-white">Ventas Recientes</h3>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">
              Has realizado +20 ventas este mes.
            </p>
          </div>
          <div class="overflow-auto flex-1 p-0">
            <table class="w-full text-left text-sm">
              <thead>
                <tr
                  class="text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800"
                >
                  <th class="px-4 py-3 font-medium">Cliente</th>
                  <th class="px-4 py-3 font-medium text-right">Monto</th>
                  <th class="px-4 py-3 font-medium text-right">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
                @for (sale of recentSales(); track sale.id) {
                  <tr class="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td class="px-4 py-4 max-w-36 sm:max-w-50">
                      <div
                        class="font-medium text-neutral-900 dark:text-white truncate"
                        title="{{ sale.name }}"
                      >
                        {{ sale.name }}
                      </div>
                      <div class="text-xs text-neutral-500 truncate" title="{{ sale.email }}">
                        {{ sale.email }}
                      </div>
                    </td>
                    <td
                      class="px-4 py-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300 whitespace-nowrap"
                    >
                      {{ sale.amount }}
                    </td>
                    <td class="px-4 py-4 text-right whitespace-nowrap">
                      <ui-badge
                        [variant]="
                          sale.status === 'Completado'
                            ? 'success'
                            : sale.status === 'Pendiente'
                              ? 'warning'
                              : 'outline'
                        "
                      >
                        {{ sale.status }}
                      </ui-badge>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private supabase = inject(SupabaseService);
  today = formatDate(new Date(), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Expose formatters to template
  formatCurrency = formatCurrency;
  formatNumber = formatNumber;

  // Signals for data
  totalRevenue = signal(0);
  customersCount = signal(0);
  salesCount = signal(0);
  pendingOrdersCount = signal(0);

  // Derived signal for stats to keep template clean
  stats = computed(() => [
    {
      label: 'Ingresos Totales',
      value: formatCurrency(this.totalRevenue()),
      trend: 12.5, // Hardcoded trend for now as we don't have historical data easily
      icon: 'currency',
    },
    {
      label: 'Clientes',
      value: formatNumber(this.customersCount()),
      trend: 8.2,
      icon: 'users',
    },
    {
      label: 'Ventas Completadas',
      value: formatNumber(this.salesCount()),
      trend: 5.4,
      icon: 'shopping-cart',
    },
    {
      label: 'Pedidos Pendientes',
      value: formatNumber(this.pendingOrdersCount()),
      trend: -2.1,
      icon: 'activity',
    },
  ]);

  chartData = signal<{ month: string; value: number }[]>([]);

  maxChartValue = computed(() => {
    const values = this.chartData().map((d) => d.value);
    return values.length ? Math.max(...values) * 1.2 : 100;
  });

  recentSales = signal<any[]>([]);

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      // 1. Customers Count
      const { count: customersCount } = await this.supabase.client
        .from('customers')
        .select('*', { count: 'exact', head: true });
      this.customersCount.set(customersCount || 0);

      // 2. Pending Orders Count
      const { count: pendingCount } = await this.supabase.client
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      this.pendingOrdersCount.set(pendingCount || 0);

      // 3. Fetch Completed Orders for Revenue, Sales Count, and Chart
      const { data: completedOrders } = await this.supabase.client
        .from('orders')
        .select('total_price, placed_at')
        .eq('status', 'completed');

      if (completedOrders) {
        // Sales Count
        this.salesCount.set(completedOrders.length);

        // Revenue
        const revenue = completedOrders.reduce((sum, order) => sum + (order.total_price || 0), 0);
        this.totalRevenue.set(revenue);

        // Chart Data (Aggregate by month for current year)
        this.processChartData(completedOrders);
      }

      // 4. Recent Sales (Orders with Customers)
      const { data: recentOrders } = await this.supabase.client
        .from('orders')
        .select('*, customers(full_name, email)')
        .order('placed_at', { ascending: false })
        .limit(5);

      if (recentOrders) {
        const mappedSales = recentOrders.map((order) => ({
          id: order.id,
          name: (order.customers as any)?.full_name || 'Desconocido',
          email: (order.customers as any)?.email || 'Sin email',
          amount: formatCurrency(order.total_price),
          status:
            order.status === 'completed'
              ? 'Completado'
              : order.status === 'pending'
                ? 'Pendiente'
                : 'Cancelado',
          rawStatus: order.status,
        }));
        this.recentSales.set(mappedSales);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  processChartData(orders: any[]) {
    // Generate months dynamically in Spanish using the util
    const months = Array.from({ length: 12 }, (_, i) => {
      const name = getMonthName(i);
      return name.charAt(0).toUpperCase() + name.slice(1);
    });

    const currentYear = new Date().getFullYear();
    const monthlyData = new Array(12).fill(0);

    orders.forEach((order) => {
      const date = new Date(order.placed_at);
      if (date.getFullYear() === currentYear) {
        monthlyData[date.getMonth()] += order.total_price;
      }
    });

    // If no data for the year yet, show simpler placeholder or just zeros
    // For now, we return the real data even if zeros
    this.chartData.set(months.map((m, i) => ({ month: m, value: monthlyData[i] })));
  }
}
