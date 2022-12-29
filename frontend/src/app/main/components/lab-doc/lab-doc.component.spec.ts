import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabDocComponent } from './lab-doc.component';

describe('LabDocComponent', () => {
  let component: LabDocComponent;
  let fixture: ComponentFixture<LabDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
