import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraCartTotalsComponent } from './altra-cart-totals.component';

describe('AltraCartTotalsComponent', () => {
  let component: AltraCartTotalsComponent;
  let fixture: ComponentFixture<AltraCartTotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraCartTotalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraCartTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
