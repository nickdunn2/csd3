import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import { JwtHelper } from 'angular2-jwt'

import { CookieService } from '../shared/services/cookie.service'

export interface IUserIdentity {
  analyticsData: any
  id: string
  claims: any
  roles: Set<string>
  username?: string
  email?: string
  new_facebook_user?: boolean
  tokenHash: string
  isAdmin(): boolean
  isPremium(): boolean
  isAdFree(): boolean
  isInRole(role: string): boolean
}

export interface ITokenResponse {
  token: string
  exp: number
  refresh_token: string
  refresh_token_exp: number
  user: IUserIdentity
  user_id: number
}

@Injectable()
export class AuthService {
  private jwtHelper = new JwtHelper()

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  public login(email: string, password: string): Observable<ITokenResponse> {
    return this.http.post<ITokenResponse>('https://staging-api.flosports.tv/api/tokens', { email, password })
  }

  public setTokenRaw(rawToken: string) {
    this.cookieService.set('jwt_token', rawToken, {
      secure: false,
      path: '/',
      expires: this.getTokenExpirationDate(rawToken)
    })
  }

  private getTokenExpirationDate(rawToken: string): Date {
    return this.jwtHelper.getTokenExpirationDate(rawToken)
  }
}
