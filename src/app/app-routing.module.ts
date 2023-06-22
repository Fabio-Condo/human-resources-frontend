import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './security/login/login.component';
import { JobsPageComponent } from './jobs/jobs-page/jobs-page.component';

const routes: Routes = [
  //{ path: 'nao-autorizado', component: NaoAutorizadoComponent },
  { path: 'v1/jobs-page', component: JobsPageComponent },
  { path: '', redirectTo: 'v1/jobs-page', pathMatch: 'full' },
  //{ path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },
  //{ path: '**', redirectTo: 'pagina-nao-encontrada' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
