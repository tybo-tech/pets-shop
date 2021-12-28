import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraOperatingHoursComponent } from './altra-operating-hours.component';

describe('AltraOperatingHoursComponent', () => {
  let component: AltraOperatingHoursComponent;
  let fixture: ComponentFixture<AltraOperatingHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraOperatingHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraOperatingHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
