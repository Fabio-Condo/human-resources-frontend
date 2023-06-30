import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PositionsComponent } from './positions/positions.component';
import { AuthenticationGuard } from '../guard/authentication.guard';


const routes: Routes = [
    { 
      path: 'v1/positions', 
      component: PositionsComponent,
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
export class PositionsRoutingModule { }