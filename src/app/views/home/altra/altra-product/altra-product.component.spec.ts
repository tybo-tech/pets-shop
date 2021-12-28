import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraProductComponent } from './altra-product.component';

describe('AltraProductComponent', () => {
  let component: AltraProductComponent;
  let fixture: ComponentFixture<AltraProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
