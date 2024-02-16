import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from '../guard/authentication.guard';
import { FilesComponent } from './files/files.component';
import { AwsS3FilesComponent } from './aws-s3-files/aws-s3-files.component';


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
  {
    path: 'v1/s3-files',
    component: AwsS3FilesComponent,
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