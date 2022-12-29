import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabWriteSectionTextComponent } from './lab-write-section-text.component';

describe('LabWriteSectionTextComponent', () => {
  let component: LabWriteSectionTextComponent;
  let fixture: ComponentFixture<LabWriteSectionTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabWriteSectionTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabWriteSectionTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
