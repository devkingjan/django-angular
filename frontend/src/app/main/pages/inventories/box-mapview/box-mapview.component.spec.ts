import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxMapviewComponent } from './box-mapview.component';

describe('BoxMapviewComponent', () => {
  let component: BoxMapviewComponent;
  let fixture: ComponentFixture<BoxMapviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxMapviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxMapviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
