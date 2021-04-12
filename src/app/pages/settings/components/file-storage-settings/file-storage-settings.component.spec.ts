import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileStorageSettingsComponent } from './file-storage-settings.component';

describe('FileStorageSettingsComponent', () => {
  let component: FileStorageSettingsComponent;
  let fixture: ComponentFixture<FileStorageSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileStorageSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileStorageSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
