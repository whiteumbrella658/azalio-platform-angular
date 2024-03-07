import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftRequestsComponent } from './gift-requests.component';

describe('GiftRequestsComponent', () => {
  let component: GiftRequestsComponent;
  let fixture: ComponentFixture<GiftRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
