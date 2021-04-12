import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolsListComponent } from './rols-component.component';

describe('RolsListComponent', () => {
  let component: RolsListComponent;
  let fixture: ComponentFixture<RolsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
