import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellCultureHistoryNavigatePanelComponent } from './cell-culture-history-navigate-panel.component';

describe('CellCultureHistoryNavigatePanelComponent', () => {
  let component: CellCultureHistoryNavigatePanelComponent;
  let fixture: ComponentFixture<CellCultureHistoryNavigatePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellCultureHistoryNavigatePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellCultureHistoryNavigatePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
