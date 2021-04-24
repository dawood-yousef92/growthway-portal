import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersStatusesComponent } from './orders-statuses.component';

describe('OrdersStatusesComponent', () => {
  let component: OrdersStatusesComponent;
  let fixture: ComponentFixture<OrdersStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
