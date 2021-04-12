import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockoutSettingsComponent } from './lockout-settings.component';

describe('LockoutSettingsComponent', () => {
  let component: LockoutSettingsComponent;
  let fixture: ComponentFixture<LockoutSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockoutSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockoutSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
