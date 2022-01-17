import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QtyBtnComponent } from './qty-btn.component';

describe('QtyBtnComponent', () => {
  let component: QtyBtnComponent;
  let fixture: ComponentFixture<QtyBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QtyBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QtyBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
