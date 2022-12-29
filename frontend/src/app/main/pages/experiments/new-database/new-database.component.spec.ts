import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDatabaseComponent } from './new-database.component';

describe('NewDatabaseComponent', () => {
  let component: NewDatabaseComponent;
  let fixture: ComponentFixture<NewDatabaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDatabaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
