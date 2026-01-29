import { Component, inject } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { ButtonDirective } from '@ui/components/button.directive';

@Component({
  selector: 'app-login',
  imports: [ButtonDirective],
  template: `
    <div class="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div class="w-full max-w-sm space-y-8 px-4">
        <!-- Logo / Brand -->
        <div class="flex flex-col items-center gap-2 text-center">
          <div
            class="w-12 h-12 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-lg flex items-center justify-center mb-4"
          >
            <svg
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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Bienvenido a Mercosys
          </h1>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            Inicia sesión para gestionar tus pedidos y clientes
          </p>
        </div>

        <!-- Login Button -->
        <div class="grid gap-4">
          <button
            uiButton
            variant="outline"
            size="lg"
            class="w-full relative gap-2"
            (click)="handleLogin()"
          >
            <!-- Github Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
              ></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
            Continuar con GitHub
          </button>
        </div>

        <p class="px-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Al continuar, aceptas nuestros términos de servicio y política de privacidad.
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private supabase = inject(SupabaseService);

  async handleLogin() {
    await this.supabase.signInWithGithub();
  }
}
