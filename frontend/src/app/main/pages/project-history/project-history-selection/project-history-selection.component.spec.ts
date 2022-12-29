import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHistorySelectionComponent } from './project-history-selection.component';

describe('ProjectHistorySelectionComponent', () => {
  let component: ProjectHistorySelectionComponent;
  let fixture: ComponentFixture<ProjectHistorySelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectHistorySelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectHistorySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
