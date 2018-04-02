import { NgModule } from '@angular/core'

import { CookieService } from './services/cookie.service'

@NgModule({
  providers: [
    CookieService
  ]
})
export class SharedModule {
}
