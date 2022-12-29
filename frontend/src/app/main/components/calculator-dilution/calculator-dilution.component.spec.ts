import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorDilutionComponent } from './calculator-dilution.component';

describe('CalculatorDilutionComponent', () => {
  let component: CalculatorDilutionComponent;
  let fixture: ComponentFixture<CalculatorDilutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatorDilutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorDilutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
