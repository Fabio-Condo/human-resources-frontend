import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersComponent } from './users/users.component';
import { AuthenticationGuard } from '../guard/authentication.guard';


const routes: Routes = [
    { 
      path: 'v1/user-profile', 
      component: UserProfileComponent,
      canActivate: [AuthenticationGuard]
    },
    { 
      path: 'v1/users', 
      component: UsersComponent,
      canActivate: [AuthenticationGuard]
    }

    /*
    { 
      path: 'users', 
      component: UserSearchComponent,
      canActivate: [AuthenticationGuard],
    },
    { 
      path: 'user/profile', 
      component: UserProfileComponent,
      canActivate: [AuthenticationGuard],
    },
    { 
      path: 'user/profile/:username', 
      component: UserProfileViewComponent,
      canActivate: [AuthenticationGuard],
    }
    */
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class UserProfileRoutingModule { }