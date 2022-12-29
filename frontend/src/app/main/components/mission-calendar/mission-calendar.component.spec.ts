import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionCalendarComponent } from './mission-calendar.component';

describe('MissionCalendarComponent', () => {
  let component: MissionCalendarComponent;
  let fixture: ComponentFixture<MissionCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
