import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleConfirmComponent } from './double-confirm.component';

describe('DoubleConfirmComponent', () => {
  let component: DoubleConfirmComponent;
  let fixture: ComponentFixture<DoubleConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubleConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubleConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
