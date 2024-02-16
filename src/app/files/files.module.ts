import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesComponent } from './files/files.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { AwsS3FilesComponent } from './aws-s3-files/aws-s3-files.component';
import { ProgressBarModule } from 'primeng/progressbar';



@NgModule({
  declarations: [
    FilesComponent,
    AwsS3FilesComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    TooltipModule,
    ProgressBarModule
  ],

})
export class FilesModule { }
