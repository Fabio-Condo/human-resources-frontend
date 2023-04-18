import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerformanceEvaluationsComponent } from './performance-evaluations/performance-evaluations.component';


const routes: Routes = [
    { 
      path: 'v1/performance-evaluations', 
      component: PerformanceEvaluationsComponent,
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class PerformanceEvaluationsRoutingModule { }