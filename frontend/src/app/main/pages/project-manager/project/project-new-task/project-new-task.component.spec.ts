import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectNewTaskComponent } from './project-new-task.component';

describe('ProjectNewTaskComponent', () => {
  let component: ProjectNewTaskComponent;
  let fixture: ComponentFixture<ProjectNewTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectNewTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectNewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
