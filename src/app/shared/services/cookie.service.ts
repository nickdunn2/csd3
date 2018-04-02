import { CookieAttributes, getJSON, remove, set } from 'js-cookie'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

export class CookieService {
  private cookieSource = new BehaviorSubject<{ [key: string]: any }>(
    this.getAll()
  )
  public cookies$ = this.cookieSource.asObservable()

  public set(name: string, value: any, options?: CookieAttributes): void {
    set(name, value, options)
    this.updateSource()
  }

  public remove(name: string, options?: CookieAttributes): void {
    remove(name, options)
    this.updateSource()
  }

  public get(name: string): any {
    return getJSON(name)
  }

  public getAll(): any {
    return getJSON()
  }

  private updateSource() {
    this.cookieSource.next(this.getAll())
  }
}
