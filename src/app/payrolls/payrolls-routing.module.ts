import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayrollsComponent } from './payrolls/payrolls.component';


const routes: Routes = [
    { 
      path: 'v1/payrolls', 
      component: PayrollsComponent,
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class PayrollsRoutingModule { }