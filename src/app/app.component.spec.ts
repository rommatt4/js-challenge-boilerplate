import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { PolicyApiService } from './services/policy-api.service';

describe('AppComponent', () => {
  const policyApiServiceMock = jasmine.createSpyObj<PolicyApiService>('PolicyApiService', [
    'submitPolicies'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: PolicyApiService, useValue: policyApiServiceMock }]
    }).compileComponents();
  });

  beforeEach(() => {
    policyApiServiceMock.submitPolicies.calls.reset();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders page title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Kin OCR');
  });

  it('disables submit button when there are no policies', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });

  it('shows success message after successful submission', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.policies = [{ policyNumber: '345882865', isValid: true }];
    policyApiServiceMock.submitPolicies.and.returnValue(of({ id: 101 }));

    app.submitPolicies();
    fixture.detectChanges();

    expect(app.alertType).toBe('success');
    expect(app.alertMessage).toContain('Response ID: 101');
    expect(policyApiServiceMock.submitPolicies).toHaveBeenCalledWith(app.policies);
  });

  it('shows error message when submission fails', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.policies = [{ policyNumber: '664371495', isValid: false }];
    policyApiServiceMock.submitPolicies.and.returnValue(throwError(() => new Error('boom')));

    app.submitPolicies();

    expect(app.alertType).toBe('error');
    expect(app.alertMessage).toContain('Submission failed');
  });
});
