import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPermissionComponent } from './member-permission.component';

describe('MemberPermissionComponent', () => {
  let component: MemberPermissionComponent;
  let fixture: ComponentFixture<MemberPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
