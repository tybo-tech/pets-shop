import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSuccessAdminComponent } from './order-success-admin.component';

describe('OrderSuccessAdminComponent', () => {
  let component: OrderSuccessAdminComponent;
  let fixture: ComponentFixture<OrderSuccessAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSuccessAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSuccessAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
