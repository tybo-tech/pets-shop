import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraNgStyleComponent } from './altra-ng-style.component';

describe('AltraNgStyleComponent', () => {
  let component: AltraNgStyleComponent;
  let fixture: ComponentFixture<AltraNgStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraNgStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraNgStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
