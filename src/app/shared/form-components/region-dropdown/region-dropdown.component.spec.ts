import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionDropdownComponent } from './region-dropdown.component';

describe('RegionDropdownComponent', () => {
  let component: RegionDropdownComponent;
  let fixture: ComponentFixture<RegionDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
