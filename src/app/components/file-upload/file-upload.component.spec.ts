import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let fixture: ComponentFixture<FileUploadComponent>;
  let component: FileUploadComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits fileSelected for valid csv', () => {
    spyOn(component.fileSelected, 'emit');
    spyOn(component.error, 'emit');

    const file = new File(['345882865'], 'policies.csv', { type: 'text/csv' });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file] });

    component.onFileChange({ target: input } as unknown as Event);

    expect(component.fileSelected.emit).toHaveBeenCalledWith(file);
    expect(component.error.emit).not.toHaveBeenCalled();
  });

  it('emits error for invalid file type', () => {
    spyOn(component.error, 'emit');

    const file = new File(['{}'], 'policies.json', { type: 'application/json' });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file] });

    component.onFileChange({ target: input } as unknown as Event);

    expect(component.error.emit).toHaveBeenCalledWith('Please upload a valid CSV file.');
  });
});
