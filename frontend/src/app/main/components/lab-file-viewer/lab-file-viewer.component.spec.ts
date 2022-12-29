import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabFileViewerComponent } from './lab-file-viewer.component';

describe('LabFileViewerComponent', () => {
  let component: LabFileViewerComponent;
  let fixture: ComponentFixture<LabFileViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabFileViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabFileViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
