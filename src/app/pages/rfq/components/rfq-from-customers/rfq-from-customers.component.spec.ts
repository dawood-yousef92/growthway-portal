import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqFromCustomersComponent } from './rfq-from-customers.component';

describe('RfqFromCustomersComponent', () => {
  let component: RfqFromCustomersComponent;
  let fixture: ComponentFixture<RfqFromCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqFromCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqFromCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
