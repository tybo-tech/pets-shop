import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraBreadcrumbComponent } from './altra-breadcrumb.component';

describe('AltraBreadcrumbComponent', () => {
  let component: AltraBreadcrumbComponent;
  let fixture: ComponentFixture<AltraBreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraBreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
