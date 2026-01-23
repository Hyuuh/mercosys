import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  // State
  private _theme = signal<Theme>('system');
  private _systemDark = signal<boolean>(false);

  // Public API
  theme = this._theme.asReadonly();

  isDark = computed(() => {
    if (this._theme() === 'system') {
      return this._systemDark();
    }
    return this._theme() === 'dark';
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize system preference
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      this._systemDark.set(media.matches);

      // Listen for system changes
      media.addEventListener('change', (e) => {
        this._systemDark.set(e.matches);
        // applyTheme will be triggered by effect if theme is system
      });

      this.loadTheme();
    }

    effect(() => {
      this.applyTheme();
      this.saveTheme();
    });
  }

  setTheme(theme: Theme) {
    this._theme.set(theme);
  }

  toggle() {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  private loadTheme() {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) {
      this._theme.set(saved);
    }
  }

  private saveTheme() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this._theme());
    }
  }

  private applyTheme() {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = window.document.documentElement;
    const isDark = this.isDark();

    root.classList.remove('light', 'dark');
    root.classList.add(isDark ? 'dark' : 'light');
  }
}
