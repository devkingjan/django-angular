import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabWriteSectionTableComponent } from './lab-write-section-table.component';

describe('LabWriteSectionTableComponent', () => {
  let component: LabWriteSectionTableComponent;
  let fixture: ComponentFixture<LabWriteSectionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabWriteSectionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabWriteSectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
