import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteNotebookComponent } from './write-notebook.component';

describe('WriteNotebookComponent', () => {
  let component: WriteNotebookComponent;
  let fixture: ComponentFixture<WriteNotebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteNotebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
