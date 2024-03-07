import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPointsTableViewComponent } from './user-points-table-view.component';

describe('UserPointsTableViewComponent', () => {
  let component: UserPointsTableViewComponent;
  let fixture: ComponentFixture<UserPointsTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPointsTableViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPointsTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
