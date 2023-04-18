import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PositionsComponent } from './positions/positions.component';


const routes: Routes = [
    { 
      path: 'v1/positions', 
      component: PositionsComponent,
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class PositionsRoutingModule { }