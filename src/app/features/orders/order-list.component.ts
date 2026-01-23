import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { ButtonDirective } from '../../ui/components/button.directive';
import { BadgeComponent } from '../../ui/components/badge.component';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, RouterLink, ButtonDirective, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Pedidos
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
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
        class="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead
              class="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium h-10"
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
            <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
              @for (order of dataService.orders(); track order.id) {
                <tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td
                    class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[100px]"
                    title="{{ order.id }}"
                  >
                    <span class="font-mono text-xs text-zinc-500 dark:text-zinc-500">#</span
                    >{{ order.id.slice(-6) }}
                  </td>
                  <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
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
                  <td class="px-4 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                    {{ order.placedAt | date: 'mediumDate' }}
                  </td>
                  <td
                    class="px-4 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap"
                  >
                    {{ order.totalPrice | currency: 'USD' }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-center gap-1">
                      <a
                        [routerLink]="['/orders', order.id]"
                        class="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors p-1"
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
                        class="text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors p-1"
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
                  <td colspan="6" class="p-8 text-center text-zinc-500 dark:text-zinc-400">
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

  deleteOrder(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta orden?')) {
      this.dataService.deleteOrder(id);
    }
  }
}
