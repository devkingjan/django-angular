import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabWriteChooseImgComponent } from './lab-write-choose-img.component';

describe('LabWriteChooseImgComponent', () => {
  let component: LabWriteChooseImgComponent;
  let fixture: ComponentFixture<LabWriteChooseImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabWriteChooseImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabWriteChooseImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
