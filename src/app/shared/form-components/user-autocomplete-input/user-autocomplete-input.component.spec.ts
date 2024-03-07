import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAutocompleteInputComponent } from './user-autocomplete-input.component';

describe('UserAutocompleteInputComponent', () => {
  let component: UserAutocompleteInputComponent;
  let fixture: ComponentFixture<UserAutocompleteInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAutocompleteInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAutocompleteInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
