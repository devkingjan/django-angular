import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleLocationComponent } from './sample-location.component';

describe('SampleLocationComponent', () => {
  let component: SampleLocationComponent;
  let fixture: ComponentFixture<SampleLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
