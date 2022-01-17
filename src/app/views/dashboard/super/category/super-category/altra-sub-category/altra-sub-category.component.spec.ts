import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraSubCategoryComponent } from './altra-sub-category.component';

describe('AltraSubCategoryComponent', () => {
  let component: AltraSubCategoryComponent;
  let fixture: ComponentFixture<AltraSubCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraSubCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
