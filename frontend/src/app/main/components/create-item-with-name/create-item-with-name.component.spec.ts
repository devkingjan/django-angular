import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemWithNameComponent } from './create-item-with-name.component';

describe('CreateItemWithNameComponent', () => {
  let component: CreateItemWithNameComponent;
  let fixture: ComponentFixture<CreateItemWithNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateItemWithNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateItemWithNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
