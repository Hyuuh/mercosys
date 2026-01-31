import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '@core/services/data.service';
import { ButtonDirective } from '@ui/components/button.directive';
import { BadgeComponent } from '@ui/components/badge.component';
import { formatDate } from '@core/utils/date-formatter';
import { formatCurrency } from '@core/utils/number-formatter';

@Component({
  selector: 'app-order-list',
  imports: [RouterLink, ButtonDirective, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Pedidos
          </h2>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            Gestiona y revisa las órdenes compra.
          </p>
        </div>
        <a routerLink="/orders/new" uiButton variant="primary">
          <svg
            class="mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nueva Orden
        </a>
      </div>

      <div
        class="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm overflow-hidden"
      >
        <div class="overflow-auto max-h-150">
          <table class="w-full text-sm text-left">
            <thead
              class="sticky top-0 z-10 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium h-10"
            >
              <tr>
                <th class="px-4 py-3 align-middle font-medium whitespace-nowrap">ID</th>
                <th class="px-4 py-3 align-middle font-medium whitespace-nowrap">Cliente</th>
                <th class="px-4 py-3 align-middle font-medium whitespace-nowrap">Estado</th>
                <th class="px-4 py-3 align-middle font-medium whitespace-nowrap">Fecha</th>
                <th class="px-4 py-3 align-middle font-medium text-right whitespace-nowrap">
                  Total
                </th>
                <th class="px-4 py-3 align-middle font-medium text-center whitespace-nowrap">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
              @for (order of dataService.orders(); track order.id) {
                <tr class="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td
                    class="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-25"
                    title="{{ order.id }}"
                  >
                    <span class="font-mono text-xs text-neutral-500 dark:text-neutral-500">#</span
                    >{{ order.id.slice(-6) }}
                  </td>
                  <td class="px-4 py-3 text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                    {{ order.customerName }}
                  </td>
                  <td class="px-4 py-3">
                    <ui-badge
                      [variant]="
                        order.status === 'completed'
                          ? 'success'
                          : order.status === 'pending'
                            ? 'warning'
                            : 'secondary'
                      "
                    >
                      {{
                        order.status === 'completed'
                          ? 'Completada'
                          : order.status === 'pending'
                            ? 'Pendiente'
                            : order.status
                      }}
                    </ui-badge>
                  </td>
                  <td class="px-4 py-3 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    {{ formatDate(order.placed_at) }}
                  </td>
                  <td
                    class="px-4 py-3 text-right font-medium text-neutral-900 dark:text-neutral-100 whitespace-nowrap"
                  >
                    {{ formatCurrency(order.total_price) }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-center gap-1">
                      <a
                        [routerLink]="['/orders', order.id]"
                        class="text-neutral-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors p-1"
                      >
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
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </a>
                      <button
                        (click)="deleteOrder(order.id)"
                        class="text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 transition-colors p-1"
                      >
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
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="p-8 text-center text-neutral-500 dark:text-neutral-400">
                    No hay órdenes registradas.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class OrderListComponent {
  dataService = inject(DataService);
  formatDate = formatDate;
  formatCurrency = formatCurrency;

  deleteOrder(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta orden?')) {
      this.dataService.deleteOrder(id);
    }
  }
}
