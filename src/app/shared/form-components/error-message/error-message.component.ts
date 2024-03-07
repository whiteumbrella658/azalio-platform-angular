import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent {
  @Input() form: FormGroup;
  @Input() key: any;
  @Input() isSubmitted: boolean;
  @Input() index:number;
  @Input() text: string;


  errorDetails = {
    required: 'This is required.',
    max: 'Exceeding max limit: ',
    min: 'Exceeding min limit: ',
    minlength: 'Min characters: ',
    maxlength: 'Max characters: ',
    email: 'Invalid email address.',
    password: 'Your password must be 8 to 25 characters. It should include a special character, a digit, one upper and one lower case letter.',
    confirmPassword: 'Passwords do not match.',
    wrongPassword: 'Incorrect password.',
    samePassword: 'Old and new password is same.',
    verificationCode: 'Verification code should be a number of four or six digits.',
    mobileNumber: 'Incorrect mobile number for UK region.',
    duplicateEmail: 'Email id already exists.',
    duplicateMobileNumber: 'Contact number id already exists.',
    whiteSpacesInput: 'Empty spaces are not allowed.',
    unique: 'Already added in the list.',
    pattern: 'Invalid format.',
    pin: 'Invalid format.',
    patternInvalid: 'Invalid characters used.',
    nbDatepickerMin: 'Past dates cannot be selected.'
  }
  errorTypes = ['required', 'max', 'min', 'email', 'password', 'confirmPassword', 'verificationCode', 'unique', 'maxDigits'];
  constructor() {
   }

}
