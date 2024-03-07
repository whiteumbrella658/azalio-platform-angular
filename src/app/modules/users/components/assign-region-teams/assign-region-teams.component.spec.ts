import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRegionTeamsComponent } from './assign-region-teams.component';

describe('AssignRegionTeamsComponent', () => {
  let component: AssignRegionTeamsComponent;
  let fixture: ComponentFixture<AssignRegionTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignRegionTeamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignRegionTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
