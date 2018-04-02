import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'

import { AuthService } from '../auth.service'
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
  private get emailValue() {
    return this.email && this.email.value
  }
  private get passwordValue() {
    return this.password && this.password.value
  }

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  public submitForm() {
    this.auth.login(this.emailValue, this.passwordValue)
      .subscribe(res => {
        console.log('success --', res)
      }, err => {
        console.log('error --', err)
      })
  }
}
