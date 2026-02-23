import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'error';

@Component({
  selector: 'app-status-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p
      class="alert"
      [class.success]="type === 'success'"
      [class.error]="type === 'error'"
      [attr.role]="type === 'error' ? 'alert' : 'status'"
      [attr.aria-live]="type === 'error' ? 'assertive' : 'polite'"
    >
      {{ message }}
    </p>
  `,
  styles: [
    `
      .alert {
        margin: 0;
        padding: 0.6rem 0.75rem;
        border-radius: 4px;
        border: 2px solid transparent;
        font-weight: 600;
      }

      .success {
        background: var(--color-success-100);
        border-color: var(--color-success-400);
        color: var(--color-success-600);
      }

      .error {
        background: var(--color-warning-100);
        border-color: var(--color-warning-400);
        color: var(--color-warning-600);
      }
    `
  ]
})
export class StatusAlertComponent {
  // Keep alert simple; parent controls message + type.
  @Input({ required: true }) type: AlertType = 'success';
  @Input({ required: true }) message = '';
}
