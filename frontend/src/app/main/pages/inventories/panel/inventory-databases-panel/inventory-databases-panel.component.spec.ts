import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDatabasesPanelComponent } from './inventory-databases-panel.component';

describe('InventoryDatabasesPanelComponent', () => {
  let component: InventoryDatabasesPanelComponent;
  let fixture: ComponentFixture<InventoryDatabasesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryDatabasesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDatabasesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
