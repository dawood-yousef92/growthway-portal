import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninSettingsComponent } from './signin-settings.component';

describe('SigninSettingsComponent', () => {
  let component: SigninSettingsComponent;
  let fixture: ComponentFixture<SigninSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigninSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
