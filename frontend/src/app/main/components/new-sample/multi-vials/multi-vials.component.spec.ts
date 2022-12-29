import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiVialsComponent } from './multi-vials.component';

describe('MultiVialsComponent', () => {
  let component: MultiVialsComponent;
  let fixture: ComponentFixture<MultiVialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiVialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiVialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
