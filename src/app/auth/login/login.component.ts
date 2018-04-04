import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import 'rxjs/add/operator/map'

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

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router
  ) {}

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
        if (user.isAdmin()) {
          this.router.navigate(['/users'])
        } else {
          this.password.setErrors({ not_admin: true })
        }
      }, err => {
        this.password.setErrors({ invalid_login: true })
        console.error(err.error, err.message)
      })
  }
}
