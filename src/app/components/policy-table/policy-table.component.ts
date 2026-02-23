import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyRecord } from '../../models/policy.model';

@Component({
  selector: 'app-policy-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="results" [attr.aria-busy]="isLoading" [class.loading]="isLoading">
      <div class="summary" *ngIf="policies.length > 0">
        <p><strong>Total:</strong> {{ policies.length }}</p>
        <p><strong>Valid:</strong> {{ validCount }}</p>
        <p><strong>Invalid:</strong> {{ invalidCount }}</p>
      </div>

      <div class="table-wrapper" *ngIf="policies.length > 0; else noData">
      <table aria-label="Policy number validation table">
        <thead>
          <tr>
            <th class="index-col" scope="col">#</th>
            <th scope="col">Policy #</th>
            <th scope="col">Result</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let policy of policies; let i = index">
            <td class="index-col">{{ i + 1 }}</td>
            <td>{{ policy.policyNumber }}</td>
            <td>
              <span class="chip" [class.valid]="policy.isValid" [class.invalid]="!policy.isValid">
                {{ policy.isValid ? 'Valid' : 'Error' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ng-template #noData>
      <p class="empty-state">Upload a CSV file to see policy results.</p>
    </ng-template>
    </section>
  `,
  styles: [
    `
      .results.loading {
        opacity: 0.65;
      }

      .summary {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem 1rem;
        margin-bottom: 0.75rem;
        padding: 0.5rem 0.65rem;
        border: 1px solid var(--color-neutral-400);
        border-radius: 6px;
        background: var(--color-secondary-100);
      }

      .summary p {
        margin: 0;
        font-size: 0.9rem;
      }

      .table-wrapper {
        width: 100%;
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        background: var(--color-neutral-white);
      }

      th,
      td {
        border: 2px solid var(--color-neutral-black);
        padding: 0.4rem 0.55rem;
        text-align: left;
      }

      th {
        background: var(--color-secondary-100);
        color: var(--color-secondary-700);
        font-weight: 700;
      }

      tbody tr:nth-child(even) {
        background: var(--color-primary-100);
      }

      .index-col {
        width: 2.25rem;
        text-align: center;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        border: 1px solid transparent;
        border-radius: 999px;
        font-size: 0.82rem;
        font-weight: 700;
        padding: 0.15rem 0.5rem;
      }

      .valid {
        background: var(--color-success-100);
        border-color: var(--color-success-400);
        color: var(--color-success-600);
      }

      .invalid {
        background: var(--color-warning-100);
        border-color: var(--color-warning-400);
        color: var(--color-warning-600);
      }

      .empty-state {
        margin: 0;
        color: var(--color-neutral-700);
        padding: 0.55rem 0.65rem;
        border: 1px solid var(--color-neutral-400);
        border-radius: 6px;
        background: var(--color-neutral-100);
      }
    `
  ]
})
export class PolicyTableComponent {
  // Display-only component, parent sends ready-to-render rows.
  @Input({ required: true }) policies: PolicyRecord[] = [];
  @Input() isLoading = false;

  get validCount(): number {
    return this.policies.filter((policy) => policy.isValid).length;
  }

  get invalidCount(): number {
    return this.policies.length - this.validCount;
  }
}
