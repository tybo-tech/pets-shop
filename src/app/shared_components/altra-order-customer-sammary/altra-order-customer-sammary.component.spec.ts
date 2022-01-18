import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraOrderCustomerSammaryComponent } from './altra-order-customer-sammary.component';

describe('AltraOrderCustomerSammaryComponent', () => {
  let component: AltraOrderCustomerSammaryComponent;
  let fixture: ComponentFixture<AltraOrderCustomerSammaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraOrderCustomerSammaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraOrderCustomerSammaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
