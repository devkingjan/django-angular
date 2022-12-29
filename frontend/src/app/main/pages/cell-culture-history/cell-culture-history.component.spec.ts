import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellCultureHistoryComponent } from './cell-culture-history.component';

describe('CellCultureHistoryComponent', () => {
  let component: CellCultureHistoryComponent;
  let fixture: ComponentFixture<CellCultureHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellCultureHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellCultureHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
