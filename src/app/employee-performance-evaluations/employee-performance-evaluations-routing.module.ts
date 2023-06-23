import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeePerformanceEvaluationsComponent } from './employee-performance-evaluations/employee-performance-evaluations.component';
import { AuthenticationGuard } from '../guard/authentication.guard';


const routes: Routes = [
    { 
      path: 'v1/employee-performance-evaluations', 
      component: EmployeePerformanceEvaluationsComponent,
      canActivate: [AuthenticationGuard]
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class EmployeePerformanceEvaluationsRoutingModule { }