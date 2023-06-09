import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VocationsComponent } from './vocations/vocations.component';


const routes: Routes = [
    { 
      path: 'v1/vocations', 
      component: VocationsComponent,
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class VocationsRoutingModule { }