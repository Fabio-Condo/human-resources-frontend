import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyTrainingsComponent } from './company-trainings/company-trainings.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { AppRoutingModule } from '../app-routing.module';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
MultiSelectModule 



@NgModule({
  declarations: [
    CompanyTrainingsComponent
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
    TagModule,
    MultiSelectModule,
    
    RouterModule,
    AppRoutingModule
  ]
})
export class CompanyTrainingsModule { }
