import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabWriteSectionFileComponent } from './lab-write-section-file.component';

describe('LabWriteSectionFileComponent', () => {
  let component: LabWriteSectionFileComponent;
  let fixture: ComponentFixture<LabWriteSectionFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabWriteSectionFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabWriteSectionFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
