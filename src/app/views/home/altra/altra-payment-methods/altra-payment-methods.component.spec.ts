import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraPaymentMethodsComponent } from './altra-payment-methods.component';

describe('AltraPaymentMethodsComponent', () => {
  let component: AltraPaymentMethodsComponent;
  let fixture: ComponentFixture<AltraPaymentMethodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraPaymentMethodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraPaymentMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
