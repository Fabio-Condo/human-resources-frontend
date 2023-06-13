import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyTrainingTypesComponent } from './company-training-types/company-training-types.component';


const routes: Routes = [
    { 
      path: 'v1/company-training-types', 
      component: CompanyTrainingTypesComponent,
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class CompanyTrainingsTypesRoutingModule { }