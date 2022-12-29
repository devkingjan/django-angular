import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellCultureEventPanelComponent } from './cell-culture-event-panel.component';

describe('CellCultureEventPanelComponent', () => {
  let component: CellCultureEventPanelComponent;
  let fixture: ComponentFixture<CellCultureEventPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellCultureEventPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellCultureEventPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
