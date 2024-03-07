import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsesPageComponent } from './responses-page.component';

describe('ResponsesPageComponent', () => {
  let component: ResponsesPageComponent;
  let fixture: ComponentFixture<ResponsesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponsesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
