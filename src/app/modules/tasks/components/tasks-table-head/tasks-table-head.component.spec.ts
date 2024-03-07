import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksTableHeadComponent } from './tasks-table-head.component';

describe('TasksTableHeadComponent', () => {
  let component: TasksTableHeadComponent;
  let fixture: ComponentFixture<TasksTableHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksTableHeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksTableHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
