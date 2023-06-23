import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkplacesComponent } from './workplaces/workplaces.component';
import { AuthenticationGuard } from '../guard/authentication.guard';


const routes: Routes = [
    { 
      path: 'v1/workplaces', 
      component: WorkplacesComponent,
      canActivate: [AuthenticationGuard]
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class WorkplacesRoutingModule { }