import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-badge',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="classes()">
      <ng-content></ng-content>
    </div>
  `,
})
export class BadgeComponent {
  variant = input<'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'>(
    'default',
  );

  classes = computed(() => {
    const base =
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:focus:ring-neutral-300';

    switch (this.variant()) {
      case 'default':
        return `${base} border-transparent bg-neutral-900 text-neutral-50 hover:bg-neutral-900/80 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/80`;
      case 'secondary':
        return `${base} border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80`;
      case 'destructive':
        return `${base} border-transparent bg-red-500 text-neutral-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/80`;
      case 'success':
        return `${base} border-transparent bg-emerald-500 text-white hover:bg-emerald-500/80 dark:bg-emerald-900 dark:text-emerald-50 dark:hover:bg-emerald-900/80`;
      case 'warning':
        return `${base} border-transparent bg-amber-500 text-white hover:bg-amber-500/80 dark:bg-amber-900 dark:text-amber-50 dark:hover:bg-amber-900/80`;
      case 'outline':
        return `${base} text-neutral-950 dark:text-neutral-50`;
      default:
        return base;
    }
  });
}
