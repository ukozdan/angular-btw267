import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export interface Currency {
  value: string;
  viewValue: string;
}

export interface CardType {
  value: string;
  viewValue: string;
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})

export class AppComponent  {
  name = 'Angular';

  currencies: Currency[] = [
    {value: 'GBP', viewValue: '£'},
    {value: 'USD', viewValue: '$'},
    {value: 'EUR', viewValue: '€'}
  ];

  cards: CardType[] = [
    {value: 'Debit card', viewValue: 'Debit card'},
    {value: 'Credit card (a 2% surcharge will be added)', viewValue: 'Credit card (a 2% surcharge will be added)'}
  ];
}

export class InputErrorStateMatcherExample {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();
}