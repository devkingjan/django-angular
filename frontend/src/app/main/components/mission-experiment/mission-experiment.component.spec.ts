import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionExperimentComponent } from './mission-experiment.component';

describe('MissionExperimentComponent', () => {
  let component: MissionExperimentComponent;
  let fixture: ComponentFixture<MissionExperimentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionExperimentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionExperimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
