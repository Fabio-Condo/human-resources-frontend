import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from '../guard/authentication.guard';
import { FilesComponent } from './files/files.component';


const routes: Routes = [
    { 
      path: 'v1/files', 
      component: FilesComponent, 
      canActivate: [AuthenticationGuard], 
      data: { 
        roles: ['ROLE_SUPER_ADMIN'], 
        requiresRoleCheck: true
      } 
    },
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class FilesRoutingModule { }