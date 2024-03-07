import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteTagInputComponent } from './autocomplete-tag-input.component';

describe('AutocompleteTagInputComponent', () => {
  let component: AutocompleteTagInputComponent;
  let fixture: ComponentFixture<AutocompleteTagInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutocompleteTagInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteTagInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
