import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
  ElementRef,
  HostListener,
  contentChildren,
  effect,
  ChangeDetectionStrategy,
  computed,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-select-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50 cursor-pointer"
      [class.bg-neutral-100]="selected()"
      [class.text-neutral-900]="selected()"
      [class.dark:bg-neutral-800]="selected()"
      [class.dark:text-neutral-50]="selected()"
      (click)="select()"
    >
      @if (selected()) {
        <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
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
            class="h-4 w-4"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      }
      <ng-content></ng-content>
    </div>
  `,
})
export class SelectItemComponent {
  @Input() value: any;
  @Output() itemSelected = new EventEmitter<{ value: any; label: string }>();

  el = inject(ElementRef);
  parent = inject(SelectComponent, { skipSelf: true });

  selected = computed(() => this.parent.value() === this.value);

  select() {
    const label = this.el.nativeElement.textContent.trim();
    this.parent.selectItem(this.value, label);
  }
}

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative" (clickOutside)="close()">
      <button
        type="button"
        (click)="toggle()"
        class="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300"
        [class.opacity-50]="disabled()"
      >
        <span [class.text-neutral-500]="!value() && placeholder">{{
          displayLabel() || placeholder
        }}</span>
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
          class="h-4 w-4 opacity-50"
        >
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </button>

      @if (isOpen()) {
        <div
          class="absolute top-[calc(100%+4px)] left-0 z-50 min-w-[8rem] w-full overflow-hidden rounded-md border border-neutral-200 bg-white text-neutral-950 shadow-md animate-in fade-in-0 zoom-in-95 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
        >
          <div class="p-1 max-h-[200px] overflow-y-auto">
            <ng-content></ng-content>
          </div>
        </div>
      }
    </div>
  `,
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class SelectComponent implements ControlValueAccessor {
  @Input() placeholder = '';

  isOpen = signal(false);
  value = signal<any>(null);
  disabled = signal(false);
  displayLabel = signal('');

  // We need to keep track of items to get initial label if value is set programmatically
  items = contentChildren(SelectItemComponent);

  private el = inject(ElementRef);

  // ControlValueAccessor methods
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {
    // When items change or value changes, try to update the label
    effect(() => {
      const currentItems = this.items();
      const currentValue = this.value();

      if (currentValue !== null && currentItems.length > 0) {
        const selectedItem = currentItems.find((i) => i.value === currentValue);
        if (selectedItem) {
          // We need to wait for the view to initialize to get textContent effectively usually,
          // but here we are in an effect.
          setTimeout(() => {
            this.displayLabel.set(selectedItem.el.nativeElement.textContent.trim());
          });
        }
      } else if (currentValue === null) {
        this.displayLabel.set('');
      }
    });
  }

  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  toggle() {
    if (this.disabled()) return;
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.onTouched();
    }
  }

  close() {
    this.isOpen.set(false);
  }

  selectItem(value: any, label: string) {
    this.value.set(value);
    this.displayLabel.set(label);
    this.onChange(value);
    this.close();
  }

  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
