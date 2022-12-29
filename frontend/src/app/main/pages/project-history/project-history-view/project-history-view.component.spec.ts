import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHistoryViewComponent } from './project-history-view.component';

describe('ProjectHistoryViewComponent', () => {
  let component: ProjectHistoryViewComponent;
  let fixture: ComponentFixture<ProjectHistoryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectHistoryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectHistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
