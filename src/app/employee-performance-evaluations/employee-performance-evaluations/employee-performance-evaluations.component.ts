import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { IApiResponse } from 'src/app/interfaces/IApiResponse';
import { IEmployeePerformanceEvaluation } from 'src/app/interfaces/IEmployeePerformanceEvaluation';
import { IEmployeePerformanceEvaluationFilter } from 'src/app/interfaces/IEmployeePerformanceEvaluationFilter';
import { EmployeePerformanceEvaluation } from 'src/app/model/EmployeePerformanceEvaluation';
import { EmployeePerformanceEvaluationsService } from '../employee-performance-evaluations.service';

@Component({
  selector: 'app-employee-performance-evaluations',
  templateUrl: './employee-performance-evaluations.component.html',
  styleUrls: ['./employee-performance-evaluations.component.css']
})
export class EmployeePerformanceEvaluationsComponent implements OnInit {

  showLoading: boolean = false;

  totalRecords: number = 0
  employeePerformanceEvaluations: EmployeePerformanceEvaluation[] = [];

  sizePage = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];

  orderPage = [
    { label: 'Funcionário (crescente)', value: 'employee.name,asc' },
    { label: 'Funcionário Level (decrescente)', value: 'employee.name,desc' },
    { label: 'Id (crescente)', value: 'id,asc' },
    { label: 'Id (decrescente)', value: 'id,desc' },
  ];

  constructor(
    private employeePerformanceEvaluationsService: EmployeePerformanceEvaluationsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {

  }

  @ViewChild('table') grid: any;

  filter: IEmployeePerformanceEvaluationFilter = {
    page: 0,
    itemsPerPage: 5,
    sort: 'employee.name,asc'
  }

  getEmployeePerformanceEvaluations(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.employeePerformanceEvaluationsService.getEmployeePerformanceEvaluations(this.filter).subscribe(
      (data: IApiResponse<IEmployeePerformanceEvaluation>) => {
        this.employeePerformanceEvaluations = data.content;
        this.totalRecords = data.totalElements;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );   
  }

  deleteEmployeePerformanceEvaluations(employeePerformanceEvaluation: EmployeePerformanceEvaluation) {
    this.employeePerformanceEvaluationsService.delete(employeePerformanceEvaluation.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.getEmployeePerformanceEvaluations();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Employee performance Evaluation deleted succefully!' })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  deletionConfirm(employeePerformanceEvaluation: IEmployeePerformanceEvaluation): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.deleteEmployeePerformanceEvaluations(employeePerformanceEvaluation);
      }
    });
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.getEmployeePerformanceEvaluations(page);
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
