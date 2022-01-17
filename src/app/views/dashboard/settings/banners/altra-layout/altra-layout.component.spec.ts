import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraLayoutComponent } from './altra-layout.component';

describe('AltraLayoutComponent', () => {
  let component: AltraLayoutComponent;
  let fixture: ComponentFixture<AltraLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
