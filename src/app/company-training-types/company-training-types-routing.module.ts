import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyTrainingTypesComponent } from './company-training-types/company-training-types.component';
import { AuthenticationGuard } from '../guard/authentication.guard';


const routes: Routes = [
    { 
      path: 'v1/company-training-types', 
      component: CompanyTrainingTypesComponent,
      canActivate: [AuthenticationGuard]
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class CompanyTrainingsTypesRoutingModule { }