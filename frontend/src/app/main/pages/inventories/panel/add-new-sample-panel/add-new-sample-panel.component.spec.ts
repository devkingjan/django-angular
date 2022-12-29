import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSamplePanelComponent } from './add-new-sample-panel.component';

describe('AddNewSamplePanelComponent', () => {
  let component: AddNewSamplePanelComponent;
  let fixture: ComponentFixture<AddNewSamplePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewSamplePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewSamplePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
