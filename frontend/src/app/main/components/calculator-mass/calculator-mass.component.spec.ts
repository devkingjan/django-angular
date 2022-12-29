import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorMassComponent } from './calculator-mass.component';

describe('CalculatorMassComponent', () => {
  let component: CalculatorMassComponent;
  let fixture: ComponentFixture<CalculatorMassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatorMassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorMassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
