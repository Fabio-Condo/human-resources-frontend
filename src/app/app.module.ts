import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdministrativeClustersRoutingModule } from './administrative-clusters/administrative-clusters-routing.module';
import { AdministrativeClustersModule } from './administrative-clusters/administrative-clusters.module';

import { AppComponent } from './app.component';
import { DepartmentRoutingModule } from './departments/department-routing.module';
import { DepartmentModule } from './departments/department.module';
import { PerformanceEvaluationsRoutingModule } from './performance-evaluations/performance-evaluations-routing.module';
import { PerformanceEvaluationsModule } from './performance-evaluations/performance-evaluations.module';
import { PositionsRoutingModule } from './positions/positions-routing.module';
import { PositionsModule } from './positions/positions.module';
import { SkillsRoutingModule } from './skills/skills-routing.module';
import { SkillsModule } from './skills/skills.module';
import { WorkplacesRoutingModule } from './workplaces/workplaces-routing.module';
import { WorkplacesModule } from './workplaces/workplaces.module';
import { CoreModule } from './core/core.module';
import { EmployeesModule } from './employees/employees.module';
import { EmployeesRoutingModule } from './employees/employees-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    ConfirmDialogModule,
    ToastModule,

    DepartmentRoutingModule,
    WorkplacesRoutingModule,
    SkillsRoutingModule,
    AdministrativeClustersRoutingModule,
    PositionsRoutingModule,
    PerformanceEvaluationsRoutingModule,
    EmployeesRoutingModule,
    DepartmentModule,
    WorkplacesModule,
    SkillsModule,
    AdministrativeClustersModule,
    PositionsModule,
    PerformanceEvaluationsModule,
    EmployeesModule,

    CoreModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
