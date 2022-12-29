import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCellCultureEventComponent } from './new-cell-culture-event.component';

describe('NewCellCultureEventComponent', () => {
  let component: NewCellCultureEventComponent;
  let fixture: ComponentFixture<NewCellCultureEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCellCultureEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCellCultureEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
