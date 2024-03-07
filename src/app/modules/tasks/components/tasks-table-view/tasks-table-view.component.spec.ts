import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksTableViewComponent } from './tasks-table-view.component';

describe('TasksTableViewComponent', () => {
  let component: TasksTableViewComponent;
  let fixture: ComponentFixture<TasksTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksTableViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
