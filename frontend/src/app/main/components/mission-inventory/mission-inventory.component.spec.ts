import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionInventoryComponent } from './mission-inventory.component';

describe('MissionInventoryComponent', () => {
  let component: MissionInventoryComponent;
  let fixture: ComponentFixture<MissionInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
