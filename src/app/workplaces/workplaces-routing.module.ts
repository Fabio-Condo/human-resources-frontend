import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkplacesComponent } from './workplaces/workplaces.component';


const routes: Routes = [
    { 
      path: 'v1/workplaces', 
      component: WorkplacesComponent,
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class WorkplacesRoutingModule { }