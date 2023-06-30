import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from '../guard/authentication.guard';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';
import { NaoAutorizadoComponent } from './nao-autorizado.component';

const routes: Routes = [

    { 
      path: 'pagina-nao-encontrada', 
      component: PaginaNaoEncontradaComponent,
      canActivate: [AuthenticationGuard],
    }

];

  @NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class CoreRoutingModule { }