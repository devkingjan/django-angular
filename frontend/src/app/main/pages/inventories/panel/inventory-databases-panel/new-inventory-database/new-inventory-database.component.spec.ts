import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInventoryDatabaseComponent } from './new-inventory-database.component';

describe('NewInventoryDatabaseComponent', () => {
  let component: NewInventoryDatabaseComponent;
  let fixture: ComponentFixture<NewInventoryDatabaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewInventoryDatabaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInventoryDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
