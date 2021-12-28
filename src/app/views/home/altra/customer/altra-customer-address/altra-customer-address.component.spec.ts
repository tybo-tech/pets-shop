import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraCustomerAddressComponent } from './altra-customer-address.component';

describe('AltraCustomerAddressComponent', () => {
  let component: AltraCustomerAddressComponent;
  let fixture: ComponentFixture<AltraCustomerAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraCustomerAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraCustomerAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
