import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraCartItemsComponent } from './altra-cart-items.component';

describe('AltraCartItemsComponent', () => {
  let component: AltraCartItemsComponent;
  let fixture: ComponentFixture<AltraCartItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraCartItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraCartItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
