import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraDeliveryComponent } from './altra-delivery.component';

describe('AltraDeliveryComponent', () => {
  let component: AltraDeliveryComponent;
  let fixture: ComponentFixture<AltraDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
