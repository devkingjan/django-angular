import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveOptionComponent } from './remove-option.component';

describe('RemoveOptionComponent', () => {
  let component: RemoveOptionComponent;
  let fixture: ComponentFixture<RemoveOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
