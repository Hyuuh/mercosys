import { Component, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormGroup } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

import { DataService } from '@core/services/data.service';
import { ButtonDirective } from '@ui/components/button.directive';
import { InputDirective } from '@ui/components/forms.directive';
import { SelectComponent, SelectItemComponent } from '@ui/components/select/select.component';
import { DecimalPipe } from '@angular/common';

import { Order } from '@core/models';

@Component({
  selector: 'app-order-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonDirective,
    InputDirective,
    SelectComponent,
    SelectItemComponent,
    DecimalPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4 gap-4"
      >
        <div>
          <h2 class="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            {{ isEditMode() ? 'Editar Orden' : 'Nueva Orden' }}
          </h2>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            {{
              isEditMode()
                ? 'Modifica los detalles de la orden existente.'
                : 'Crea una nueva orden de compra para un cliente.'
            }}
          </p>
        </div>
        <div class="flex gap-2">
          <a routerLink="/orders" uiButton variant="outline"> Cancelar </a>
          <button
            type="submit"
            form="order-form"
            [disabled]="orderForm.invalid || items.length === 0"
            uiButton
            variant="primary"
          >
            {{ isEditMode() ? 'Actualizar Orden' : 'Guardar Orden' }}
          </button>
        </div>
      </div>

      <form id="order-form" (ngSubmit)="onSubmit()" [formGroup]="orderForm" class="space-y-8">
        <!-- Customer Selection & Status -->
        <div
          class="bg-white dark:bg-neutral-950 p-6 rounded-md border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4"
        >
          <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-50">
            1. Detalles Generales
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div class="grid w-full gap-1.5">
              <label class="text-sm font-medium leading-none text-neutral-900 dark:text-neutral-100"
                >Cliente</label
              >
              <ui-select formControlName="customer_id" placeholder="Selecciona un cliente">
                @for (c of dataService.customers(); track c.id) {
                  <ui-select-item [value]="c.id">{{ c.full_name }} ({{ c.email }})</ui-select-item>
                }
              </ui-select>
              @if (orderForm.get('customer_id')?.invalid && orderForm.get('customer_id')?.touched) {
                <p class="text-xs text-red-500 font-medium">Debes seleccionar un cliente.</p>
              }
            </div>

            <div class="grid w-full gap-1.5">
              <label class="text-sm font-medium leading-none text-neutral-900 dark:text-neutral-100"
                >Estado de la Orden</label
              >
              <ui-select formControlName="status" placeholder="Selecciona el estado">
                <ui-select-item value="pending">Pendiente</ui-select-item>
                <ui-select-item value="completed">Completada</ui-select-item>
                <ui-select-item value="cancelled">Cancelada</ui-select-item>
              </ui-select>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div
          class="bg-white dark:bg-neutral-950 p-6 rounded-md border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-50">
              2. Agregar Productos
            </h3>
            <button type="button" (click)="addItem()" uiButton variant="secondary" size="sm">
              + Agregar Item
            </button>
          </div>

          <div formArrayName="items" class="space-y-4">
            @for (itemCtrl of items.controls; track $index; let i = $index) {
              <div
                [formGroupName]="i"
                class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b border-neutral-100 dark:border-neutral-800 pb-4 last:border-0 last:pb-0"
              >
                <div class="col-span-1 md:col-span-6 space-y-1">
                  @if (i === 0 || items.length > 0) {
                    <label class="text-xs font-medium text-neutral-900 dark:text-neutral-100"
                      >Producto</label
                    >
                  }
                  <ui-select
                    formControlName="productId"
                    (ngModelChange)="onProductSelect(i)"
                    placeholder="Seleccionar producto..."
                  >
                    @for (p of dataService.products(); track p.id) {
                      <ui-select-item [value]="p.id">{{ p.name }} - \${{ p.price }}</ui-select-item>
                    }
                  </ui-select>
                </div>
                <div class="col-span-1 md:col-span-2 space-y-1">
                  @if (i === 0 || items.length > 0) {
                    <label class="text-xs font-medium text-neutral-900 dark:text-neutral-100"
                      >Cantidad</label
                    >
                  }
                  <input uiInput type="number" formControlName="quantity" min="1" placeholder="1" />
                </div>
                <div class="col-span-1 md:col-span-2 space-y-1">
                  @if (i === 0 || items.length > 0) {
                    <label class="text-xs font-medium text-neutral-900 dark:text-neutral-100"
                      >Precio Unit.</label
                    >
                  }
                  <div
                    class="flex h-10 w-full items-center rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400 shadow-sm"
                  >
                    $ {{ itemCtrl.get('unitPrice')?.value || 0 }}
                  </div>
                </div>
                <div class="col-span-1 md:col-span-2 flex justify-end pb-1 md:pb-0">
                  <button
                    type="button"
                    (click)="removeItem(i)"
                    uiButton
                    variant="destructive"
                    size="icon"
                    class="w-full md:w-10"
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
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            }
            @if (items.length === 0) {
              <div
                class="text-center py-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md text-neutral-500 dark:text-neutral-400 text-sm"
              >
                No hay productos en la orden. Agrega uno para continuar.
              </div>
            }
          </div>

          <!-- Summary -->
          <div
            class="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4"
          >
            <div class="w-full md:w-1/3 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-neutral-500 dark:text-neutral-400">Subtotal</span>
                <span class="font-medium text-neutral-900 dark:text-neutral-100"
                  >\${{ total() | number: '1.2-2' }}</span
                >
              </div>
              <div
                class="flex justify-between text-base font-semibold text-neutral-900 dark:text-neutral-50 border-t border-neutral-200 dark:border-neutral-800 pt-2"
              >
                <span>Total Global</span>
                <span>\${{ total() | number: '1.2-2' }}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class OrderFormComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  dataService = inject(DataService);

  orderForm = this.fb.group({
    customer_id: ['', Validators.required],
    status: ['pending', Validators.required],
    items: this.fb.array([]),
  });

  get items() {
    return this.orderForm.get('items') as FormArray;
  }

  total = signal(0);
  isEditMode = signal(false);
  orderId = signal<string | null>(null);

  constructor() {
    this.orderForm.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    // Check for edit mode
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode.set(true);
        this.orderId.set(id);
      }
    });

    effect(() => {
      const id = this.orderId();
      const orders = this.dataService.orders();
      if (id && orders.length > 0) {
        const order = orders.find((o) => o.id === id);
        if (order) {
          this.patchForm(order);
        }
      }
    });
  }

  patchForm(order: Order) {
    this.orderForm.patchValue({
      customer_id: order.customer_id,
      status: order.status,
    });

    this.items.clear();
    if (order.order_items) {
      order.order_items.forEach((item) => {
        const itemGroup = this.fb.group({
          productId: [item.product_id, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          unitPrice: [{ value: item.unit_price, disabled: true }],
        });
        this.items.push(itemGroup);
      });
      // Force recalculation
      this.calculateTotal();
    }
  }

  addItem() {
    const itemGroup = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [{ value: 0, disabled: true }],
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  onProductSelect(index: number) {
    const group = this.items.at(index) as FormGroup;
    const productId = group.get('productId')?.value;
    const product = this.dataService.products().find((p) => p.id === productId);

    if (product) {
      group.patchValue({ unitPrice: product.price });
    }
  }

  calculateTotal() {
    let sum = 0;
    this.items.controls.forEach((ctrl) => {
      const qty = ctrl.get('quantity')?.value || 0;
      const price = ctrl.get('unitPrice')?.value || 0;
      sum += qty * price;
    });
    this.total.set(sum);
  }

  onSubmit() {
    if (this.orderForm.valid) {
      const formVal = this.orderForm.getRawValue(); // use getRawValue to get disabled fields too

      // Prepare data for service
      const items = formVal.items!.map((item: any) => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      }));

      if (this.isEditMode() && this.orderId()) {
        this.dataService.updateOrder(
          this.orderId()!,
          {
            customer_id: formVal.customer_id!,
            total_price: this.total(),
            status: (formVal.status as any) || 'pending',
          },
          items,
        );
      } else {
        this.dataService.addOrder(
          {
            customer_id: formVal.customer_id!,
            total_price: this.total(),
            status: (formVal.status as any) || 'pending',
          },
          items,
        );
      }

      this.router.navigate(['/orders']);
    }
  }
}
