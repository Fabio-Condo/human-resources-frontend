import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DepartmentComponent } from './departments/departments/department.component';

const routes: Routes = [
  { path: 'department', component: DepartmentComponent },
  { path: '', redirectTo: 'v1/departments', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
