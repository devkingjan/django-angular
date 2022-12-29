import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellCultureHistoryViewComponent } from './cell-culture-history-view.component';

describe('CellCultureHistoryViewComponent', () => {
  let component: CellCultureHistoryViewComponent;
  let fixture: ComponentFixture<CellCultureHistoryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellCultureHistoryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellCultureHistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
