import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabWriteSectionImageComponent } from './lab-write-section-image.component';

describe('LabWriteSectionImageComponent', () => {
  let component: LabWriteSectionImageComponent;
  let fixture: ComponentFixture<LabWriteSectionImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabWriteSectionImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabWriteSectionImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
