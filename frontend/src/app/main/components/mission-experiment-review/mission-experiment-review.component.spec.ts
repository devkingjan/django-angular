import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionExperimentReviewComponent } from './mission-experiment-review.component';

describe('MissionExperimentReviewComponent', () => {
  let component: MissionExperimentReviewComponent;
  let fixture: ComponentFixture<MissionExperimentReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionExperimentReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionExperimentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
