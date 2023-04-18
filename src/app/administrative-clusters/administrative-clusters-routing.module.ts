import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrativeClustersComponent } from './administrative-clusters/administrative-clusters.component';


const routes: Routes = [
    { 
      path: 'v1/administrative-clusters', 
      component: AdministrativeClustersComponent,
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdministrativeClustersRoutingModule { }