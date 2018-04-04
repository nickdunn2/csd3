import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FlexLayoutModule } from '@angular/flex-layout'

import { CookieService } from './services/cookie.service'
import { MaterialModule } from '../material.module'

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule
  ],
  providers: [
    CookieService
  ]
})
export class SharedModule {
}
