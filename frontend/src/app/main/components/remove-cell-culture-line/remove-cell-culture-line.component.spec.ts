import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCellCultureLineComponent } from './remove-cell-culture-line.component';

describe('RemoveCellCultureLineComponent', () => {
  let component: RemoveCellCultureLineComponent;
  let fixture: ComponentFixture<RemoveCellCultureLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveCellCultureLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveCellCultureLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
