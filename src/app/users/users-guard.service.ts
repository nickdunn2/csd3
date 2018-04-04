import { CanActivate, Router } from '@angular/router'
import { Injectable } from '@angular/core'

import { AuthService } from '../auth/auth.service'

@Injectable()
export class UsersGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate() {
    // TODO: Figure out how to do this with userIdentity$ stream instead of getUserFromStoredToken()
    const user = this.auth.getUserFromStoredToken()
    if (user && user.isAdmin()) {
      return true
    } else {
      this.router.navigate(['login'])
      return false
    }
  }
}
