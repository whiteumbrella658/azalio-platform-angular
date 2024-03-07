import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatNewModalComponent } from './what-new-modal.component';

describe('WhatNewModalComponent', () => {
  let component: WhatNewModalComponent;
  let fixture: ComponentFixture<WhatNewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatNewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatNewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
