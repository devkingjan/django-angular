import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabWriteESignComponent } from './lab-write-e-sign.component';

describe('LabWriteESignComponent', () => {
  let component: LabWriteESignComponent;
  let fixture: ComponentFixture<LabWriteESignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabWriteESignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabWriteESignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
