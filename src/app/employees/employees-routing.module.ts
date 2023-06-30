import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './employees/employees.component';
import { AuthenticationGuard } from '../guard/authentication.guard';


const routes: Routes = [
    { 
      path: 'v1/employees', 
      component: EmployeesComponent, 
      canActivate: [AuthenticationGuard], 
      data: { 
        roles: ['ROLE_SUPER_ADMIN'], 
        requiresRoleCheck: true
      } 
    },
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class EmployeesRoutingModule { }