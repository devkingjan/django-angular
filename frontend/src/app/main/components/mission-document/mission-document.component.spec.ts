import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionDocumentComponent } from './mission-document.component';

describe('MissionDocumentComponent', () => {
  let component: MissionDocumentComponent;
  let fixture: ComponentFixture<MissionDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
