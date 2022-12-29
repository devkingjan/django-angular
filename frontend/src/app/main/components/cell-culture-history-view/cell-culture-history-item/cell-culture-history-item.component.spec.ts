import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellCultureHistoryItemComponent } from './cell-culture-history-item.component';

describe('CellCultureHistoryItemComponent', () => {
  let component: CellCultureHistoryItemComponent;
  let fixture: ComponentFixture<CellCultureHistoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellCultureHistoryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellCultureHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
