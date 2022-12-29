import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStorageLocationComponent } from './new-storage-location.component';

describe('NewStorageLocationComponent', () => {
  let component: NewStorageLocationComponent;
  let fixture: ComponentFixture<NewStorageLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewStorageLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStorageLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
