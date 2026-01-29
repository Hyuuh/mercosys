import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { SupabaseService } from '@core/services/supabase.service';
import { ButtonDirective } from '@ui/components/button.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonDirective, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex h-screen w-full bg-white dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 antialiased font-sans transition-colors duration-300"
    >
      <!-- Mobile Backdrop -->
      @if (sidebarOpen()) {
        <div
          class="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in"
          (click)="toggleSidebar()"
        ></div>
      }

      <!-- Sidebar (Desktop & Mobile) -->
      <aside
        [class]="
          'fixed inset-y-0 left-0 z-50 w-64 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/50 dark:backdrop-blur-xl backdrop-blur-2xl transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col ' +
          (sidebarOpen() ? 'translate-x-0' : '-translate-x-full')
        "
      >
        <div
          class="h-14 flex items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800"
        >
          <div class="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <div
              class="w-8 h-8 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-md flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
            <span>Mercosys</span>
          </div>
          <!-- Close button mobile only -->
          <button
            class="md:hidden text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-50"
            (click)="toggleSidebar()"
          >
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <a
            routerLink="/orders"
            (click)="closeSidebar()"
            routerLinkActive="bg-neutral-200/60 dark:bg-neutral-700/60 text-neutral-900 dark:text-neutral-50"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 rounded-md hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors"
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
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            Pedidos
          </a>
          <a
            routerLink="/customers"
            (click)="closeSidebar()"
            routerLinkActive="bg-neutral-200/60 dark:bg-neutral-700/60 text-neutral-900 dark:text-neutral-50"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 rounded-md hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors"
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Clientes
          </a>
          <a
            routerLink="/products"
            (click)="closeSidebar()"
            routerLinkActive="bg-neutral-200/60 dark:bg-neutral-700/60 text-neutral-900 dark:text-neutral-50"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 rounded-md hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors"
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
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Productos
          </a>
        </nav>

        <div class="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              @if (supabase.user()?.user_metadata?.['avatar_url']) {
                <img
                  [src]="supabase.user()?.user_metadata?.['avatar_url']"
                  alt="Avatar"
                  class="h-full w-full object-cover"
                />
              } @else {
                <div
                  class="h-full w-full flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-300"
                >
                  {{ supabase.user()?.email?.charAt(0)?.toUpperCase() }}
                </div>
              }
            </div>
            <div class="text-sm overflow-hidden">
              <p class="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {{ supabase.user()?.user_metadata?.['full_name'] || 'Usuario' }}
              </p>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {{ supabase.user()?.email }}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main
        class="flex-1 flex flex-col min-w-0 bg-white dark:bg-neutral-950 overflow-hidden transition-colors"
      >
        <!-- Header -->
        <header
          class="h-14 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 md:px-6 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm z-10 sticky top-0"
        >
          <div class="flex items-center gap-3">
            <button
              class="md:hidden p-2 -ml-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-50"
              (click)="toggleSidebar()"
            >
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
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <h1 class="font-semibold text-lg text-neutral-900 dark:text-neutral-50">Dashboard</h1>
          </div>

          <div class="flex gap-2">
            <!-- Theme Toggle -->
            <button
              uiButton
              variant="ghost"
              size="icon"
              (click)="themeService.toggle()"
              aria-label="Toggle theme"
            >
              @if (themeService.isDark()) {
                <!-- Sun Icon (Show when Dark) -->
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
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              } @else {
                <!-- Moon Icon (Show when Light) -->
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
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              }
            </button>
            <button
              uiButton
              variant="ghost"
              size="sm"
              class="ml-2 text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400"
              (click)="signOut()"
            >
              Salir
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <div class="flex-1 overflow-auto p-4 md:p-8">
          <div class="mx-auto max-w-6xl space-y-8">
            <router-outlet></router-outlet>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class LayoutComponent {
  themeService = inject(ThemeService);
  supabase = inject(SupabaseService);
  private router = inject(Router);
  sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  async signOut() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }
}
