
import { AppRoutingModule } from '../app-routing.module';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UsersComponent } from './users/users.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {FileUploadModule} from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import {SplitterModule} from 'primeng/splitter';
import {DividerModule} from 'primeng/divider';
import {ImageModule} from 'primeng/image';
import {DataViewModule} from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';



@NgModule({
  declarations: [
    UserProfileComponent,
    UsersComponent
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
    CheckboxModule,
    CardModule,
    SplitterModule,
    DividerModule,
    ImageModule,
    InputTextareaModule,
    CalendarModule,
    TagModule,

    SharedModule,
    RouterModule,
    

    InputNumberModule,
    FileUploadModule,
    HttpClientModule,
    DataViewModule,
  ]
})
export class UsersModule { }
