import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraPaymentsComponent } from './altra-payments.component';

describe('AltraPaymentsComponent', () => {
  let component: AltraPaymentsComponent;
  let fixture: ComponentFixture<AltraPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
