import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { ButtonDirective } from '../../ui/components/button.directive';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  imports: [RouterLink, ButtonDirective, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Clientes
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Directorio de clientes registrados.
          </p>
        </div>
        <a routerLink="/customers/new" uiButton variant="primary"> + Nuevo Cliente </a>
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
            <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
              @for (customer of dataService.customers(); track customer.id) {
                <tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                    <div class="flex items-center gap-2">
                      <div
                        class="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300"
                      >
                        {{ customer.fullName.slice(0, 2).toUpperCase() }}
                      </div>
                      {{ customer.fullName }}
                    </div>
                  </td>
                  <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300">{{ customer.email }}</td>
                  <td class="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    {{ customer.createdAt | date: 'mediumDate' }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-center gap-2">
                      <a
                        [routerLink]="['/customers', customer.id, 'edit']"
                        class="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors p-1"
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

  deleteCustomer(id: string) {
    if (confirm('¿Confirmas eliminar este cliente?')) {
      this.dataService.deleteCustomer(id);
    }
  }
}
