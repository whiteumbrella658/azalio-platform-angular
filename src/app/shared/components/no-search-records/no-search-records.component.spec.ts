import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSearchRecordsComponent } from './no-search-records.component';

describe('NoSearchRecordsComponent', () => {
  let component: NoSearchRecordsComponent;
  let fixture: ComponentFixture<NoSearchRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoSearchRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoSearchRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
