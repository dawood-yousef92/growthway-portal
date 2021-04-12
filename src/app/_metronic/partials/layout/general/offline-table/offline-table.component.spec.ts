import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineTableComponent } from './offline-table.component';

describe('OfflineTableComponent', () => {
  let component: OfflineTableComponent;
  let fixture: ComponentFixture<OfflineTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
