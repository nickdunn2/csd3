import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'

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
  public login(email: string, password: string): Observable<ITokenResponse> {
    console.log('auth email --', email)
    console.log('auth pw --', password)
    return this.http.post<ITokenResponse>('https://staging-api.flosports.tv/api/tokens', { email, password })
  }

  constructor(private http: HttpClient) {}
}
