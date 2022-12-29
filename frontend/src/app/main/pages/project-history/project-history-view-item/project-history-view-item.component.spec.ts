import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHistoryViewItemComponent } from './project-history-view-item.component';

describe('ProjectHistoryViewItemComponent', () => {
  let component: ProjectHistoryViewItemComponent;
  let fixture: ComponentFixture<ProjectHistoryViewItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectHistoryViewItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectHistoryViewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
