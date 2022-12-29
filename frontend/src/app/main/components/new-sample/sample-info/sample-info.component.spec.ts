import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleInfoComponent } from './sample-info.component';

describe('SampleInfoComponent', () => {
  let component: SampleInfoComponent;
  let fixture: ComponentFixture<SampleInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
