import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnDecisionComponent } from './column-decision.component';

describe('ColumnDecisionComponent', () => {
  let component: ColumnDecisionComponent;
  let fixture: ComponentFixture<ColumnDecisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnDecisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
