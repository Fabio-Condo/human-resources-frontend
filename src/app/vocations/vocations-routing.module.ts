import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VocationsComponent } from './vocations/vocations.component';
import { AuthenticationGuard } from '../guard/authentication.guard';


const routes: Routes = [
    { 
      path: 'v1/vocations', 
      component: VocationsComponent,
      canActivate: [AuthenticationGuard], 
      data: { 
        roles: ['ROLE_SUPER_ADMIN'], 
        requiresRoleCheck: true
      } 
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class VocationsRoutingModule { }