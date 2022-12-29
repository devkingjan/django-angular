import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionScannedDocumentsComponent } from './mission-scanned-documents.component';

describe('MissionScannedDocumentsComponent', () => {
  let component: MissionScannedDocumentsComponent;
  let fixture: ComponentFixture<MissionScannedDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionScannedDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionScannedDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
