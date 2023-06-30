import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyTrainingsComponent } from './company-trainings/company-trainings.component';
import { AuthenticationGuard } from '../guard/authentication.guard';


const routes: Routes = [
    { 
      path: 'v1/company-trainings', 
      component: CompanyTrainingsComponent,
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
export class CompanyTrainingsRoutingModule { }