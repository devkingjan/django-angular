import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmergencyContactComponent } from './view-emergency-contact.component';

describe('ViewEmergencyContactComponent', () => {
  let component: ViewEmergencyContactComponent;
  let fixture: ComponentFixture<ViewEmergencyContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmergencyContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmergencyContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
