import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'ma-toast-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast--{{ toast.type }}" role="alert">
          <span class="toast__icon">
            @switch (toast.type) {
              @case ('success') { ✓ }
              @case ('error')   { ✕ }
              @default          { ℹ }
            }
          </span>
          <span class="toast__msg">{{ toast.message }}</span>
          <button class="toast__dismiss" (click)="toastService.dismiss(toast.id)" aria-label="Dismiss notification">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed; bottom: 28px; right: 28px;
      z-index: 999; display: flex; flex-direction: column; gap: 10px;
    }
    .toast {
      display: flex; align-items: center; gap: 10px;
      background: var(--surface-card);
      border: 1px solid var(--crimson-light);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      font-size: 0.875rem; color: var(--text-primary);
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      animation: slide-in 0.4s cubic-bezier(0.34,1.56,0.64,1);
      max-width: 320px;
    }
    @keyframes slide-in {
      from { transform: translateY(60px); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }
    .toast__icon {
      width: 24px; height: 24px; background: var(--crimson);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; flex-shrink: 0; color: #fff;
    }
    .toast--error .toast__icon { background: #c0392b; }
    .toast--info .toast__icon  { background: #2980b9; }
    .toast__msg { flex: 1; }
    .toast__dismiss {
      color: var(--text-dim); font-size: 12px; flex-shrink: 0;
      padding: 2px 4px; transition: color var(--transition);
    }
    .toast__dismiss:hover { color: var(--accent); }
  `],
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
