import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseExperimentComponent } from './close-experiment.component';

describe('CloseExperimentComponent', () => {
  let component: CloseExperimentComponent;
  let fixture: ComponentFixture<CloseExperimentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseExperimentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseExperimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
