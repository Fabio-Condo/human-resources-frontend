import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

import { AppComponent } from './app.component';
import { DepartmentRoutingModule } from './departments/department-routing.module';
import { DepartmentModule } from './departments/department.module';
import { WorkplacesRoutingModule } from './workplaces/workplaces-routing.module';
import { WorkplacesModule } from './workplaces/workplaces.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    DepartmentRoutingModule,
    WorkplacesRoutingModule,
    DepartmentModule,
    WorkplacesModule
  ],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
