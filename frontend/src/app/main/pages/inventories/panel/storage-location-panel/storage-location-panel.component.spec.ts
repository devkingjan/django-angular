import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageLocationPanelComponent } from './storage-location-panel.component';

describe('StorageLocationPanelComponent', () => {
  let component: StorageLocationPanelComponent;
  let fixture: ComponentFixture<StorageLocationPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageLocationPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageLocationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
