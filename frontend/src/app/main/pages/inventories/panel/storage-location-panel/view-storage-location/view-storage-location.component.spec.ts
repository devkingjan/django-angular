import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStorageLocationComponent } from './view-storage-location.component';

describe('ViewStorageLocationComponent', () => {
  let component: ViewStorageLocationComponent;
  let fixture: ComponentFixture<ViewStorageLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStorageLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStorageLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
