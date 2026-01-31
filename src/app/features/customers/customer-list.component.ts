import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { RouterLink } from '@angular/router';
import { DataService } from '@core/services/data.service';
import { ButtonDirective } from '@ui/components/button.directive';
import { formatDate } from '@core/utils/date-formatter';

@Component({
  selector: 'app-customer-list',
  imports: [RouterLink, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Clientes
          </h2>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            Directorio de clientes registrados.
          </p>
        </div>
        <a routerLink="/customers/new" uiButton variant="primary"> + Nuevo Cliente </a>
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
                <th class="px-4 py-3 align-middle font-medium whitespace-nowrap">
                  Nombre Completo
                </th>
                <th class="px-4 py-3 align-middle font-medium whitespace-nowrap">Email</th>
                <th class="px-4 py-3 align-middle font-medium whitespace-nowrap">Fecha Registro</th>
                <th class="px-4 py-3 align-middle font-medium text-center whitespace-nowrap">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
              @for (customer of dataService.customers(); track customer.id) {
                <tr class="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td class="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                    <div class="flex items-center gap-2">
                      <div
                        class="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-300"
                      >
                        {{ customer.full_name.slice(0, 2).toUpperCase() }}
                      </div>
                      {{ customer.full_name }}
                    </div>
                  </td>
                  <td class="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                    {{ customer.email }}
                  </td>
                  <td class="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                    {{ formatDate(customer.created_at) }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-center gap-2">
                      <a
                        [routerLink]="['/customers', customer.id, 'edit']"
                        class="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 transition-colors p-1"
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
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                        </svg>
                      </a>
                      <button
                        (click)="deleteCustomer(customer.id)"
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
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class CustomerListComponent {
  dataService = inject(DataService);
  formatDate = formatDate;

  deleteCustomer(id: string) {
    if (confirm('¿Confirmas eliminar este cliente?')) {
      this.dataService.deleteCustomer(id);
    }
  }
}
