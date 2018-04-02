import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { JwtHelper } from 'angular2-jwt'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { sha1 } from 'object-hash'

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

export interface ITokenSchema {
  analyticsData: string
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  roles: string
  roleDelimeter: string
  adminRoleNames: ReadonlyArray<string>
}

@Injectable()
export class AuthService {
  private TOKEN_STORAGE_KEY = 'jwt_token'
  private jwtHelper = new JwtHelper()
  private userIdentitySource = new BehaviorSubject<IUserIdentity | undefined>(
    this.getUserFromStoredToken()
  )
  public userIdentity$ = this.userIdentitySource.asObservable()

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  public generateToken(email: string, password: string): Observable<ITokenResponse> {
    // TODO: Can't have hard-coded staging endpoint
    return this.http.post<ITokenResponse>('https://staging-api.flosports.tv/api/tokens', { email, password })
  }

  public setTokenRaw(rawToken: string) {
    this.cookieService.set(this.TOKEN_STORAGE_KEY, rawToken, {
      secure: false,
      path: '/',
      expires: this.getTokenExpirationDate(rawToken)
    })
  }

  public getValidToken(token: string | undefined): any {
    if (!token) {
      return undefined
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token)
      return decodedToken && !this.jwtHelper.isTokenExpired(token) ? decodedToken : undefined
    } catch (e) {
      return undefined
    }
  }

  public getTokenFromStore(): string {
    return this.cookieService.get(this.TOKEN_STORAGE_KEY)
  }

  public getUserFromStoredToken(): IUserIdentity | undefined {
    const token = this.getValidToken(this.getTokenFromStore())
    const tokenSchema = {
      analyticsData: 'analytics_data',
      id: 'id',
      email: 'email',
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastName',
      roles: 'roles',
      roleDelimeter: ',',
      adminRoleNames: ['ROLE_ADMIN']
    }
    return token ? this.userFactory(token, tokenSchema) : undefined
  }

  private getTokenExpirationDate(rawToken: string): Date {
    return this.jwtHelper.getTokenExpirationDate(rawToken)
  }

  private userFactory(tokenJson: string, schema: ITokenSchema): IUserIdentity {
    if (!tokenJson) {
      throw new Error('')
    }
    if (!schema) {
      throw new Error('')
    }

    // tslint:disable-next-line:readonly-array
    const roles = (tokenJson[schema.roles] as string[]) || []
    const roleSet = new Set<string>()

    Array.isArray(roles)
      ? roles.forEach(role => roleSet.add(role))
      : roleSet.add(roles)

    const user: IUserIdentity = {
      claims: tokenJson,
      analyticsData: tokenJson[schema.analyticsData],
      id: tokenJson[schema.id] as string,
      username: tokenJson[schema.username] as string,
      email: tokenJson[schema.email] as string,
      roles: roleSet,
      tokenHash: sha1(tokenJson),
      isInRole(name: string) {
        return roleSet.has(name)
      },
      isAdmin() {
        return schema.adminRoleNames.some(role => roleSet.has(role))
      }
    }

    return user
  }
}
