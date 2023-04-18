import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IDepartmentFilter } from 'src/app/interfaces/DepartmentFilter';
import { IApiResponse } from 'src/app/interfaces/IApiResponse';
import { IDepartment } from 'src/app/interfaces/IDepartments';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  showLoading: boolean = false;

  constructor(
    private departmentService: DepartmentService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getDepartments();
  }

  totalRecords: number = 0
  departments: IDepartment[] = [];

  filter: IDepartmentFilter = {
    page: 0,
    itemsPerPage: 5,
    sort: ''
  }

  getDepartments(): void {
    this.showLoading = true;
    this.departmentService.getDepartments(this.filter).subscribe(
      (data: IApiResponse<IDepartment>) => {
        this.departments = data.content;
        this.totalRecords = data.totalElements;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );   
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
