import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCultureMediumComponent } from './manage-options.component';

describe('ManageOptionsComponent', () => {
  let component: ManageCultureMediumComponent;
  let fixture: ComponentFixture<ManageCultureMediumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCultureMediumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCultureMediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
