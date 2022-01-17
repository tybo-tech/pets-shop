import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraOrderStepsComponent } from './altra-order-steps.component';

describe('AltraOrderStepsComponent', () => {
  let component: AltraOrderStepsComponent;
  let fixture: ComponentFixture<AltraOrderStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraOrderStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraOrderStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
