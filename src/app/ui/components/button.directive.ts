import { Directive, input, computed } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

@Directive({
  selector: '[uiButton]',
  host: {
    '[class]': 'classes()',
  },
})
export class ButtonDirective {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('default');

  classes = computed(() => {
    return `inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 ${this.getVariantClasses()} ${this.getSizeClasses()}`;
  });

  private getVariantClasses(): string {
    switch (this.variant()) {
      case 'primary':
        return 'bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90';
      case 'destructive':
        return 'bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90';
      case 'outline':
        return 'border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50';
      case 'secondary':
        return 'bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80';
      case 'ghost':
        return 'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50';
      case 'link':
        return 'text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50';
      default:
        return '';
    }
  }

  private getSizeClasses(): string {
    switch (this.size()) {
      case 'default':
        return 'h-10 px-4 py-2';
      case 'sm':
        return 'h-9 rounded-md px-3';
      case 'lg':
        return 'h-11 rounded-md px-8';
      case 'icon':
        return 'h-10 w-10';
      default:
        return '';
    }
  }
}
