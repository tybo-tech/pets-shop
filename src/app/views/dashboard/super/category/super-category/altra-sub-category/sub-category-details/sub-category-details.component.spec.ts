import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryDetailsComponent } from './sub-category-details.component';

describe('SubCategoryDetailsComponent', () => {
  let component: SubCategoryDetailsComponent;
  let fixture: ComponentFixture<SubCategoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCategoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});