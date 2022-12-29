import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTableContentComponent } from './lab-table-content.component';

describe('LabTableContentComponent', () => {
  let component: LabTableContentComponent;
  let fixture: ComponentFixture<LabTableContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabTableContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabTableContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
