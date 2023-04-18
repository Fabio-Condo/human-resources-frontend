import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentComponent } from './departments/department.component';


const routes: Routes = [
    { 
      path: 'v1/departments', 
      component: DepartmentComponent,
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class DepartmentRoutingModule { }