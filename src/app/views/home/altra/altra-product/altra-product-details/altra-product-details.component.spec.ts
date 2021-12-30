import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraProductDetailsComponent } from './altra-product-details.component';

describe('AltraProductDetailsComponent', () => {
  let component: AltraProductDetailsComponent;
  let fixture: ComponentFixture<AltraProductDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraProductDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
