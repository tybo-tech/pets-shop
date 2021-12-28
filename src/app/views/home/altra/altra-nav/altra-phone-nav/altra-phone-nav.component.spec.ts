import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraPhoneNavComponent } from './altra-phone-nav.component';

describe('AltraPhoneNavComponent', () => {
  let component: AltraPhoneNavComponent;
  let fixture: ComponentFixture<AltraPhoneNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraPhoneNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraPhoneNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
