import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraImageSliderComponent } from './altra-image-slider.component';

describe('AltraImageSliderComponent', () => {
  let component: AltraImageSliderComponent;
  let fixture: ComponentFixture<AltraImageSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraImageSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraImageSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
