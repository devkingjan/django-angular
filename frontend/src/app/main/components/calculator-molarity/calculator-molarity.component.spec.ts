import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorMolarityComponent } from './calculator-molarity.component';

describe('CalculatorMolarityComponent', () => {
  let component: CalculatorMolarityComponent;
  let fixture: ComponentFixture<CalculatorMolarityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatorMolarityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorMolarityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
