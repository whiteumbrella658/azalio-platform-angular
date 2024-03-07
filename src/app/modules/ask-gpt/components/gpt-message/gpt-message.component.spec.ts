import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GptMessageComponent } from './gpt-message.component';

describe('GptMessageComponent', () => {
  let component: GptMessageComponent;
  let fixture: ComponentFixture<GptMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GptMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GptMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
