import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../guard/authentication.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [

  {
    path: 'v1/dashboard',
    component: DashboardComponent,
    canActivate: [AuthenticationGuard],
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashBoardRoutingModule { }