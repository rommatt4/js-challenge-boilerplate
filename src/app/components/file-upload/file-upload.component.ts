import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { isCsvFile, isWithinMaxFileSize } from '../../utils/csv.util';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="upload" [attr.aria-disabled]="disabled" [class.disabled]="disabled">
      <label class="upload-title" for="csv-upload">OCR File Upload</label>
      <p class="upload-help">Upload a CSV (max 2MB).</p>
      <div class="upload-row">
        <input
          #fileInput
          id="csv-upload"
          type="file"
          accept=".csv,text/csv"
          (change)="onFileChange($event)"
          [disabled]="disabled"
          class="sr-only-input"
        />
        <label class="file-button" for="csv-upload">
          {{ selectedFileName ? 'Change file' : 'Choose file' }}
        </label>
        <span class="file-name">{{ selectedFileName || 'No file selected' }}</span>
      </div>
      <p
        *ngIf="uploadError"
        #errorAlert
        class="inline-alert error"
        role="alert"
        aria-live="assertive"
        tabindex="-1"
      >
        {{ uploadError }}
      </p>
      <p *ngIf="uploadSuccess" class="inline-alert success" aria-live="polite">
        {{ uploadSuccess }}
      </p>
    </section>
  `,
  styles: [
    `
      .upload {
        display: grid;
        gap: 0.5rem;
      }

      .upload.disabled {
        opacity: 0.7;
      }

      .upload-title {
        margin: 0;
        font-weight: 600;
        font-size: 1.05rem;
      }

      .upload-help {
        margin: 0;
        font-size: 0.88rem;
        color: var(--color-neutral-700);
      }

      .upload-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
      }

      .sr-only-input {
        position: absolute;
        opacity: 0;
        width: 1px;
        height: 1px;
        overflow: hidden;
      }

      .file-button {
        display: inline-flex;
        align-items: center;
        border: 2px solid var(--color-neutral-black);
        border-radius: 6px;
        background: var(--color-primary-100);
        padding: 0.42rem 0.85rem;
        font-size: 0.92rem;
        font-weight: 600;
        line-height: 1.2;
        cursor: pointer;
      }

      .file-button:hover {
        background: var(--color-primary-200);
      }

      .file-name {
        min-width: 0;
        flex: 1;
        color: var(--color-neutral-700);
        font-size: 0.95rem;
        word-break: break-word;
      }

      .inline-alert {
        margin: 0;
        border: 2px solid transparent;
        border-radius: 6px;
        padding: 0.45rem 0.65rem;
        font-size: 0.88rem;
      }

      .inline-alert.success {
        background: var(--color-success-100);
        border-color: var(--color-success-400);
        color: var(--color-success-600);
      }

      .inline-alert.error {
        background: var(--color-warning-100);
        border-color: var(--color-warning-400);
        color: var(--color-warning-600);
      }

      .sr-only-input:focus-visible + .file-button {
        outline: 3px solid var(--color-blue-400);
        outline-offset: 2px;
      }
    `
  ]
})
export class FileUploadComponent implements OnChanges {
  // Parent controls disabled/loading state.
  @Input() disabled = false;
  // Parent bumps this to reset local UI state.
  @Input() resetSignal = 0;
  // Parent decides what to do with a valid file.
  @Output() fileSelected = new EventEmitter<File>();
  // Emit errors up so parent owns global feedback.
  @Output() error = new EventEmitter<string>();
  @ViewChild('errorAlert') errorAlert?: ElementRef<HTMLElement>;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  selectedFileName = '';
  uploadError = '';
  uploadSuccess = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetSignal'] && !changes['resetSignal'].firstChange) {
      this.selectedFileName = '';
      this.uploadError = '';
      this.uploadSuccess = '';
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    }
  }

  onFileChange(event: Event): void {
    if (this.disabled) {
      return;
    }

    const input = event.target as HTMLInputElement;
    // Single-file upload only.
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!isCsvFile(file)) {
      // Reset input so user can re-pick right away.
      this.showError('Please upload a valid CSV file.');
      input.value = '';
      return;
    }

    if (!isWithinMaxFileSize(file)) {
      // Same reset pattern for file size errors.
      this.showError('CSV file must be 2 MB or smaller.');
      input.value = '';
      return;
    }

    this.selectedFileName = file.name;
    this.uploadError = '';
    this.uploadSuccess = `File loaded: ${file.name}`;
    this.fileSelected.emit(file);
  }

  private showError(message: string): void {
    this.uploadSuccess = '';
    this.uploadError = message;
    this.selectedFileName = '';
    this.error.emit(message);

    // Focus alert so screen readers announce it.
    setTimeout(() => this.errorAlert?.nativeElement.focus());
  }
}
