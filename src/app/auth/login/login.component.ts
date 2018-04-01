import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'

import { validateEmail } from '../../shared/validators/email.validator'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public loginForm = this.fb.group({
    'email': ['', [
        Validators.required,
        Validators.minLength(5),
        validateEmail
      ]
    ],
    'password': ['', [ Validators.required ]]
  })

  public get email() { return this.loginForm.get('email') }
  public get password() { return this.loginForm.get('password') }

  constructor(private fb: FormBuilder) { }

  public submitForm() {
    console.log('loginForm --', this.loginForm)
    // TODO: get some staging JWT crap in here
  }
}
