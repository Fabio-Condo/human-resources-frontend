import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeePerformanceEvaluationsComponent } from './employee-performance-evaluations/employee-performance-evaluations.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { AppRoutingModule } from '../app-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';



@NgModule({
  declarations: [
    EmployeePerformanceEvaluationsComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,

    ButtonModule,
    InputTextModule,
    TableModule,
    TabViewModule,
    TooltipModule,
    DropdownModule,
    SelectButtonModule,
    DialogModule,
    DividerModule,
    CalendarModule,
    InputTextareaModule,
    TagModule,

    RouterModule,
    AppRoutingModule
  ]
})
export class EmployeePerformanceEvaluationsModule { }
