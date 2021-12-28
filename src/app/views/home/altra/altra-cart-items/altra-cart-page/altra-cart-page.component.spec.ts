import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraCartPageComponent } from './altra-cart-page.component';

describe('AltraCartPageComponent', () => {
  let component: AltraCartPageComponent;
  let fixture: ComponentFixture<AltraCartPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraCartPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraCartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
