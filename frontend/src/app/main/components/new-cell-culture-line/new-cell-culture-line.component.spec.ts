import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCellCultureLineComponent } from './new-cell-culture-line.component';

describe('NewCellCultureLineComponent', () => {
  let component: NewCellCultureLineComponent;
  let fixture: ComponentFixture<NewCellCultureLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCellCultureLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCellCultureLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
