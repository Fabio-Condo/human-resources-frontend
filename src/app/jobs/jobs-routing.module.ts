import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobsComponent } from './jobs/jobs.component';
import { JobsPageComponent } from './jobs-page/jobs-page.component';
import { JobViewComponent } from './job-view/job-view.component';
import { AuthenticationGuard } from '../guard/authentication.guard';


const routes: Routes = [
    { 
      path: 'v1/jobs', 
      component: JobsComponent,
    },
    { 
      path: 'v1/jobs-page', 
      component: JobsPageComponent,
    },
    { 
      path: 'v1/jobs-view/:id', 
      component: JobViewComponent,
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class JobsRoutingModule { }