import { NgModule } from '@angular/core'

import { UsersComponent } from './users.component'
import { SharedModule } from '../shared/shared.module'
import { UsersGuard } from './users-guard.service'

@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [
    UsersGuard
  ]
})
export class UsersModule {
}
