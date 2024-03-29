import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AppComponent } from './app.component';
import { DepartmentRoutingModule } from './departments/department-routing.module';
import { DepartmentModule } from './departments/department.module';
import { PositionsRoutingModule } from './positions/positions-routing.module';
import { PositionsModule } from './positions/positions.module';
import { SkillsRoutingModule } from './skills/skills-routing.module';
import { SkillsModule } from './skills/skills.module';
import { CoreModule } from './core/core.module';
import { EmployeesModule } from './employees/employees.module';
import { EmployeesRoutingModule } from './employees/employees-routing.module';
import { EmployeePerformanceEvaluationsModule } from './employee-performance-evaluations/employee-performance-evaluations.module';
import { EmployeePerformanceEvaluationsRoutingModule } from './employee-performance-evaluations/employee-performance-evaluations-routing.module';
import { ProjectsRoutingModule } from './projects/projects-routing.module';
import { ProjectsModule } from './projects/projects.module';
import { VocationsModule } from './vocations/vocations.module';
import { VocationsRoutingModule } from './vocations/vocations-routing.module';
import { DatePipe } from '@angular/common';
import { CompanyTrainingsModule } from './company-trainings/company-trainings.module';
import { CompanyTrainingsRoutingModule } from './company-trainings/company-trainings-routing.module';
import { CompanyTrainingTypesModule } from './company-training-types/company-training-types.module';
import { CompanyTrainingsTypesRoutingModule } from './company-training-types/company-training-types-routing.module';
import { PayrollsRoutingModule } from './payrolls/payrolls-routing.module';
import { PayrollsModule } from './payrolls/payrolls.module';
import { UsersModule } from './users/users.module';
import { UserProfileRoutingModule } from './users/users-routing.module';
import { JobsModule } from './jobs/jobs.module';
import { JobsRoutingModule } from './jobs/jobs-routing.module';
import { SecurityRoutingModule } from './security/security-routing.module';
import { SecurityModule } from './security/security.module';
import { AuthenticationService } from './users/authentication.service';
import { AuthenticationGuard } from './guard/authentication.guard';
import { UserService } from './users/user.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { LocationsRoutingModule } from './locations/locations-routing.module';
import { LocationsModule } from './locations/locations.module';
import { DashBoardRoutingModule } from './dashboard/dashboard-routing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FilesRoutingModule } from './files/files-routing.module';
import { FilesModule } from './files/files.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    ConfirmDialogModule,
    ToastModule,

    DepartmentRoutingModule,
    LocationsRoutingModule,
    SkillsRoutingModule,
    PositionsRoutingModule,
    EmployeesRoutingModule,
    EmployeePerformanceEvaluationsRoutingModule,
    ProjectsRoutingModule,
    VocationsRoutingModule,
    CompanyTrainingsRoutingModule,
    CompanyTrainingsTypesRoutingModule,
    PayrollsRoutingModule,
    UserProfileRoutingModule,
    JobsRoutingModule,
    SecurityRoutingModule,
    DashBoardRoutingModule,
    FilesRoutingModule,
    FilesModule,
    DepartmentModule,
    LocationsModule,
    SkillsModule,
    PositionsModule,
    EmployeesModule,
    EmployeePerformanceEvaluationsModule,
    ProjectsModule,
    VocationsModule,
    CompanyTrainingsModule,
    CompanyTrainingTypesModule,
    PayrollsModule,
    UsersModule,
    JobsModule,
    SecurityModule,
    DashboardModule,

    CoreModule
  ],
  providers: [
    ConfirmationService, 
    MessageService, 
    AuthenticationGuard,
    AuthenticationService,   
    UserService,
    JwtHelperService,
    DatePipe,
    //{ provide: LOCALE_ID, useValue: 'fr' },
    //{ provide: LOCALE_ID, useValue: 'pt-MZ' },
    //{ provide: LOCALE_ID, useValue: 'pt-US' },
    { provide:  JWT_OPTIONS, useValue: JWT_OPTIONS} ,
    
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, 

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
