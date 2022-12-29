import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentFilterComponent } from './experiment-filter.component';

describe('ExperimentFilterComponent', () => {
  let component: ExperimentFilterComponent;
  let fixture: ComponentFixture<ExperimentFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
