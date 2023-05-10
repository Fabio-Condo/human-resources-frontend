import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { MegaMenuModule } from 'primeng/megamenu';



@NgModule({
  declarations: [
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MegaMenuModule
  ],
  exports: [
    NavbarComponent,
  ],
})
export class CoreModule { }
