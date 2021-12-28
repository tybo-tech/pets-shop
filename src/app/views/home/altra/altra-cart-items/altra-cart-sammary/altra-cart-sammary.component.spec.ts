import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraCartSammaryComponent } from './altra-cart-sammary.component';

describe('AltraCartSammaryComponent', () => {
  let component: AltraCartSammaryComponent;
  let fixture: ComponentFixture<AltraCartSammaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraCartSammaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraCartSammaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
