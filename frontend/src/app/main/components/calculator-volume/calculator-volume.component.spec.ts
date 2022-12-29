import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorVolumeComponent } from './calculator-volume.component';

describe('CalculatorVolumeComponent', () => {
  let component: CalculatorVolumeComponent;
  let fixture: ComponentFixture<CalculatorVolumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatorVolumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorVolumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
