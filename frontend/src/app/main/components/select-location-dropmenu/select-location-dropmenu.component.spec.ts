import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLocationDropmenuComponent } from './select-location-dropmenu.component';

describe('SelectLocationDropmenuComponent', () => {
  let component: SelectLocationDropmenuComponent;
  let fixture: ComponentFixture<SelectLocationDropmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLocationDropmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLocationDropmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
