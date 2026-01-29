import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '@core/services/data.service';
import { Product } from '@core/models';
import { ButtonDirective } from '@ui/components/button.directive';
import { InputDirective } from '@ui/components/forms.directive';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonDirective, InputDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4 gap-4"
      >
        <div>
          <h2 class="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            {{ isEditMode ? 'Editar Producto' : 'Nuevo Producto' }}
          </h2>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            {{
              isEditMode
                ? 'Actualiza los datos del producto.'
                : 'Registra un nuevo producto en el catálogo.'
            }}
          </p>
        </div>
        <div class="flex gap-2 items-center justify-center">
          <a routerLink="/products" uiButton variant="destructive"> Cancelar </a>
          <button (click)="onSubmit()" [disabled]="productForm.invalid" uiButton variant="primary">
            Guardar Producto
          </button>
        </div>
      </div>

      <form
        [formGroup]="productForm"
        class="bg-white dark:bg-neutral-950 p-6 rounded-md border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 max-w-2xl"
      >
        <div class="grid w-full items-center gap-1.5">
          <label
            for="sku"
            class="text-sm font-medium leading-none text-neutral-900 dark:text-neutral-100"
            >SKU</label
          >
          <input uiInput type="text" formControlName="sku" id="sku" class="font-mono" />
          @if (productForm.get('sku')?.invalid && productForm.get('sku')?.touched) {
            <p class="text-xs text-red-500 font-medium">El SKU es requerido.</p>
          }
        </div>

        <div class="grid w-full items-center gap-1.5">
          <label
            for="name"
            class="text-sm font-medium leading-none text-neutral-900 dark:text-neutral-100"
            >Nombre</label
          >
          <input uiInput type="text" formControlName="name" id="name" />
          @if (productForm.get('name')?.invalid && productForm.get('name')?.touched) {
            <p class="text-xs text-red-500 font-medium">El nombre es requerido.</p>
          }
        </div>

        <div class="grid w-full items-center gap-1.5">
          <label
            for="price"
            class="text-sm font-medium leading-none text-neutral-900 dark:text-neutral-100"
            >Precio</label
          >
          <input uiInput type="number" formControlName="price" id="price" min="0" step="0.01" />
          @if (
            productForm.get('price')?.hasError('required') && productForm.get('price')?.touched
          ) {
            <p class="text-xs text-red-500 font-medium">El precio es requerido.</p>
          }
          @if (productForm.get('price')?.hasError('min') && productForm.get('price')?.touched) {
            <p class="text-xs text-red-500 font-medium">El precio debe ser mayor o igual a 0.</p>
          }
        </div>
      </form>
    </div>
  `,
})
export class ProductFormComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  dataService = inject(DataService);

  isEditMode = false;
  productId: string | null = null;

  productForm = this.fb.group({
    sku: ['', Validators.required],
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      const product = this.dataService.getProduct(this.productId);
      if (product) {
        this.productForm.patchValue(product);
      } else {
        this.router.navigate(['/products']);
      }
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const value = this.productForm.value as Omit<Product, 'id' | 'created_at'>;

      if (this.isEditMode && this.productId) {
        this.dataService.updateProduct(this.productId, value);
      } else {
        this.dataService.addProduct(value);
      }

      this.router.navigate(['/products']);
    }
  }
}
