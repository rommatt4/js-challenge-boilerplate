import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { PolicyTableComponent } from './components/policy-table/policy-table.component';
import { StatusAlertComponent, AlertType } from './components/status-alert/status-alert.component';
import { PolicyRecord } from './models/policy.model';
import { PolicyApiService } from './services/policy-api.service';
import { parsePolicyNumbersFromCsv } from './utils/csv.util';
import { getPolicyValidation } from './utils/checksum.util';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FileUploadComponent, PolicyTableComponent, StatusAlertComponent],
  template: `
    <main class="page">
      <section class="panel" aria-label="Kin OCR policy workflow">
        <header class="page-header">
          <h1>Kin OCR</h1>
          <p class="subhead">Upload, validate, and submit policy numbers.</p>
        </header>

        <section class="section">
          <h2 class="section-title">1) Upload</h2>
          <app-file-upload
            [disabled]="isSubmitting"
            [resetSignal]="resetSignal"
            (fileSelected)="onFileSelected($event)"
            (error)="onUploadError($event)"
          />
        </section>

        <section class="section">
          <h2 class="section-title">2) Results</h2>
          <app-policy-table [policies]="policies" [isLoading]="isSubmitting" />
        </section>

        <section class="section actions">
          <h2 class="section-title">3) Actions</h2>
          <div class="action-row">
            <button
              class="submit-btn"
              type="button"
              (click)="submitPolicies()"
              [disabled]="!canSubmit || isSubmitting"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit policy numbers' }}
            </button>
            <button class="reset-btn" type="button" (click)="resetAll()" [disabled]="isSubmitting || !canReset">
              Reset
            </button>
          </div>
        </section>

        <app-status-alert *ngIf="alertType && alertMessage" [type]="alertType" [message]="alertMessage" />
      </section>
    </main>
  `,
  styles: [
    `
      .page {
        min-height: 100vh;
        padding: 1rem;
        overflow-x: clip;
        color: var(--color-neutral-black);
        background: var(--color-neutral-100);
        box-sizing: border-box;
      }

      .panel {
        width: min(100%, 960px);
        margin: 0 auto;
        min-height: calc(100vh - 2rem);
        box-sizing: border-box;
        background: linear-gradient(180deg, var(--color-neutral-white), var(--color-primary-100));
        border: 2px solid var(--color-neutral-black);
        border-radius: 10px;
        padding: 1.4rem clamp(1rem, 3vw, 2rem);
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .page-header {
        border: 1px solid var(--color-neutral-400);
        background: var(--color-neutral-white);
        border-radius: 8px;
        padding: 0.9rem 1rem;
      }

      h1 {
        margin: 0;
        text-align: left;
        letter-spacing: 0.02em;
        color: var(--color-secondary-700);
      }

      .subhead {
        margin: 0.35rem 0 0;
        text-align: left;
        color: var(--color-neutral-700);
      }

      .section {
        border: 1px solid var(--color-neutral-400);
        background: var(--color-neutral-white);
        border-radius: 8px;
        padding: 0.9rem;
      }

      .section-title {
        margin: 0 0 0.7rem;
        font-size: 0.98rem;
        color: var(--color-secondary-700);
      }

      .actions {
        margin-top: auto;
      }

      .action-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.65rem;
      }

      button {
        border: 2px solid var(--color-neutral-black);
        border-radius: 4px;
        color: var(--color-neutral-black);
        font-weight: 600;
        font-size: 0.95rem;
        line-height: 1.2;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 40px;
        padding: 0.52rem 0.9rem;
        cursor: pointer;
        transition: background 120ms ease-in-out;
      }

      .submit-btn {
        background: var(--color-primary-400);
      }

      .submit-btn:hover:not(:disabled) {
        background: var(--color-primary-500);
      }

      .reset-btn {
        background: var(--color-neutral-white);
      }

      .reset-btn:hover:not(:disabled) {
        background: var(--color-neutral-200);
      }

      button:focus-visible {
        outline: 3px solid var(--color-blue-400);
        outline-offset: 2px;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      app-status-alert {
        display: block;
      }

      @media (max-width: 640px) {
        .page {
          padding: 0.75rem;
        }

        .panel {
          min-height: calc(100vh - 1.5rem);
          padding: 1rem;
        }

        .action-row {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `
  ]
})
export class AppComponent {
  // Keep app state here so child components stay simple.
  policies: PolicyRecord[] = [];
  isSubmitting = false;
  hasLoadedFile = false;
  resetSignal = 0;
  alertType: AlertType | null = null;
  alertMessage = '';

  constructor(private readonly policyApiService: PolicyApiService) {}

  async onFileSelected(file: File): Promise<void> {
    // New file means clear old messages first.
    this.clearAlert();
    this.hasLoadedFile = true;

    try {
      const csvContent = await this.readFileAsText(file);
      // Parse CSV and attach checksum status in one pass.
      this.policies = parsePolicyNumbersFromCsv(csvContent).map(getPolicyValidation);

      if (this.policies.length === 0) {
        this.showError('No policy numbers were found in the CSV file.');
      }
    } catch {
      this.hasLoadedFile = false;
      this.showError('Unable to read the CSV file. Please try again.');
    }
  }

  submitPolicies(): void {
    // Never post an empty payload.
    if (this.policies.length === 0) {
      return;
    }

    this.isSubmitting = true;
    this.clearAlert();

    // finalize flips loading off on both success and error.
    this.policyApiService
      .submitPolicies(this.policies)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response) => {
          this.alertType = 'success';
          this.alertMessage = `Policies submitted successfully. Response ID: ${response.id}.`;
        },
        error: () => {
          this.showError('Submission failed. Please try again.');
        }
      });
  }

  onUploadError(message: string): void {
    // Bad upload clears stale rows so UI stays in sync.
    this.showError(message);
    this.hasLoadedFile = false;
    this.policies = [];
  }

  resetAll(): void {
    this.hasLoadedFile = false;
    this.policies = [];
    this.resetSignal += 1;
    this.clearAlert();
  }

  get canSubmit(): boolean {
    return this.hasLoadedFile && this.policies.length > 0;
  }

  get canReset(): boolean {
    return this.hasLoadedFile || this.policies.length > 0 || Boolean(this.alertMessage);
  }

  private showError(message: string): void {
    this.alertType = 'error';
    this.alertMessage = message;
  }

  private clearAlert(): void {
    this.alertType = null;
    this.alertMessage = '';
  }

  private readFileAsText(file: File): Promise<string> {
    // Small promise wrapper keeps file read flow clean.
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsText(file);
    });
  }
}
