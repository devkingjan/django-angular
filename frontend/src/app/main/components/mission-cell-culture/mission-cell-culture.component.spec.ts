import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionCellCultureComponent } from './mission-cell-culture.component';

describe('MissionCellCultureComponent', () => {
  let component: MissionCellCultureComponent;
  let fixture: ComponentFixture<MissionCellCultureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionCellCultureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionCellCultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
