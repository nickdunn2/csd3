import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'

import { AuthService, ITokenResponse } from '../auth.service'
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
    this.auth.generateToken(this.emailValue, this.passwordValue)
      .map((res: ITokenResponse) => {
        this.auth.setTokenRaw(res.token)
        return res
      })
      .map(() => {
        return this.auth.getUserFromStoredToken()
      })
      .subscribe(user => {
        console.log('user --', user)

        if (!user.isAdmin()) {
          this.password.setErrors({ not_admin: true })
          console.log('user does not have admin privileges')
        } else {
          console.log('user is an admin!')
        }
      }, err => {
        this.password.setErrors({ invalid_login: true })
        console.log('error --', err)
      })
  }
}
