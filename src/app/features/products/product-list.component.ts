import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '@core/services/data.service';
import { ButtonDirective } from '@ui/components/button.directive';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Productos
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">Catálogo de productos disponibles.</p>
        </div>
        <a routerLink="/products/new" uiButton variant="primary"> + Nuevo Producto </a>
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
                <th class="px-4 py-3 align-middle font-medium whitespace-nowrap">SKU</th>
                <th class="px-4 py-3 align-middle font-medium whitespace-nowrap">Nombre</th>
                <th class="px-4 py-3 align-middle font-medium text-right whitespace-nowrap">
                  Precio
                </th>
                <th class="px-4 py-3 align-middle font-medium text-center whitespace-nowrap">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
              @for (product of dataService.products(); track product.id) {
                <tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td
                    class="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300 font-mono text-xs whitespace-nowrap"
                  >
                    {{ product.sku }}
                  </td>
                  <td class="px-4 py-3 text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                    {{ product.name }}
                  </td>
                  <td
                    class="px-4 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap"
                  >
                    {{ product.price | currency: 'USD' }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-center gap-2">
                      <a
                        [routerLink]="['/products', product.id, 'edit']"
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
                        (click)="deleteProduct(product.id)"
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
export class ProductListComponent {
  dataService = inject(DataService);

  deleteProduct(id: string) {
    if (confirm('¿Confirmas eliminar este producto?')) {
      this.dataService.deleteProduct(id);
    }
  }
}
