import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { AuthenticationGuard } from '../guard/authentication.guard';


const routes: Routes = [
    { 
      path: 'v1/projects', 
      component: ProjectsComponent,
      canActivate: [AuthenticationGuard], 
      data: { 
        roles: ['ROLE_SUPER_ADMIN'], 
        requiresRoleCheck: true
      } 
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class ProjectsRoutingModule { }