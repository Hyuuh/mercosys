import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

import { DataService } from '../../core/services/data.service';
import { Customer } from '../../core/models';
import { ButtonDirective } from '../../ui/components/button.directive';
import { InputDirective } from '../../ui/components/forms.directive';

@Component({
  selector: 'app-customer-form',
  imports: [ReactiveFormsModule, RouterLink, ButtonDirective, InputDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 gap-4"
      >
        <div>
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {{ isEditMode ? 'Editar Cliente' : 'Nuevo Cliente' }}
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            {{
              isEditMode
                ? 'Actualiza los datos del cliente.'
                : 'Registra un nuevo cliente en el sistema.'
            }}
          </p>
        </div>
        <div class="flex gap-2">
          <a routerLink="/customers" uiButton variant="outline"> Cancelar </a>
          <button (click)="onSubmit()" [disabled]="customerForm.invalid" uiButton variant="primary">
            Guardar Cliente
          </button>
        </div>
      </div>

      <form
        [formGroup]="customerForm"
        class="bg-white dark:bg-zinc-950 p-6 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 max-w-2xl"
      >
        <div class="grid w-full items-center gap-1.5">
          <label
            for="fullName"
            class="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100"
            >Nombre Completo</label
          >
          <input uiInput type="text" formControlName="fullName" id="fullName" />
          @if (customerForm.get('fullName')?.invalid && customerForm.get('fullName')?.touched) {
            <p class="text-xs text-red-500 font-medium">El nombre es requerido.</p>
          }
        </div>

        <div class="grid w-full items-center gap-1.5">
          <label
            for="email"
            class="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100"
            >Email</label
          >
          <input uiInput type="email" formControlName="email" id="email" />
          @if (
            customerForm.get('email')?.hasError('required') && customerForm.get('email')?.touched
          ) {
            <p class="text-xs text-red-500 font-medium">El email es requerido.</p>
          }
          @if (customerForm.get('email')?.hasError('email') && customerForm.get('email')?.touched) {
            <p class="text-xs text-red-500 font-medium">Ingresa un email válido.</p>
          }
        </div>
      </form>
    </div>
  `,
})
export class CustomerFormComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  dataService = inject(DataService);

  isEditMode = false;
  customerId: string | null = null;

  customerForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('id');
    if (this.customerId) {
      this.isEditMode = true;
      const customer = this.dataService.getCustomer(this.customerId);
      if (customer) {
        this.customerForm.patchValue(customer);
      } else {
        this.router.navigate(['/customers']);
      }
    }
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const value = this.customerForm.value as Omit<Customer, 'id' | 'createdAt'>;

      if (this.isEditMode && this.customerId) {
        this.dataService.updateCustomer(this.customerId, value);
      } else {
        this.dataService.addCustomer(value);
      }

      this.router.navigate(['/customers']);
    }
  }
}
