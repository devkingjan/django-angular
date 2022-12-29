import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNotebookComponent } from './view-notebook.component';

describe('ViewNotebookComponent', () => {
  let component: ViewNotebookComponent;
  let fixture: ComponentFixture<ViewNotebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewNotebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
