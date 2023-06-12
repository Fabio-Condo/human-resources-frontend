import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyTrainingsComponent } from './company-trainings/company-trainings.component';


const routes: Routes = [
    { 
      path: 'v1/company-trainings', 
      component: CompanyTrainingsComponent,
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class CompanyTrainingsRoutingModule { }