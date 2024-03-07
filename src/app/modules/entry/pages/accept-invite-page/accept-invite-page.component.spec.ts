import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptInvitePageComponent } from './accept-invite-page.component';

describe('AcceptInvitePageComponent', () => {
  let component: AcceptInvitePageComponent;
  let fixture: ComponentFixture<AcceptInvitePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptInvitePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptInvitePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
