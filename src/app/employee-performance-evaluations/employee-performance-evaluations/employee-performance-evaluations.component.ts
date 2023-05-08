import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { EmployeesService } from 'src/app/employees/employees.service';
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
  employeePerformanceEvaluations: IEmployeePerformanceEvaluation[] = [];

  employeePerformanceEvaluation: IEmployeePerformanceEvaluation = new EmployeePerformanceEvaluation;
  displayModalSave: boolean = false;

  employees: any[] = [] ;

  categories = [
    { label: 'Anualmente', value: 'YEARLY' },
    { label: 'Mensalmente', value: 'MONTHLY' },
  ];
  
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
    private employeesService: EmployeesService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  @ViewChild('table') grid: any;

  filter: IEmployeePerformanceEvaluationFilter = {
    page: 0,
    itemsPerPage: 5,
    sort: 'employee.name,asc'
  }

  get editing() {
    return Boolean(this.employeePerformanceEvaluation.id);
  }

  
  save(departmentForm: NgForm) {
    if (this.editing) {
      this.update(departmentForm)
    } else {
      this.addNew(departmentForm)
    }
  }

  addNew(employeePerformanceEvaluationForm: NgForm) {
    this.showLoading = true;
    this.employeePerformanceEvaluationsService.add(this.employeePerformanceEvaluation).subscribe(
      (employeePerformanceEvaluationAdded) => {
        this.employeePerformanceEvaluation = employeePerformanceEvaluationAdded;
        this.showLoading = false;
        this.getEmployeePerformanceEvaluations();
        this.messageService.add({ severity: 'success', detail: 'Employee performance Evaluation added successfully' });      
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(employeePerformanceEvaluationForm: NgForm) {
    this.showLoading = true;
    this.employeePerformanceEvaluationsService.update(this.employeePerformanceEvaluation).subscribe(
      (employeePerformanceEvaluation) => {
        this.employeePerformanceEvaluation = employeePerformanceEvaluation;
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Employee performance Evaluation updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
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

  getEmployees() {
    return this.employeesService.findAll().subscribe(
      data => {
        this.employees = data.content.map(employee => {
          return  {
            label: employee.name,
            value: employee.id
          }
        })
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

  onAddNewEmployeePerformanceEvaluation(): void {
    this.employeePerformanceEvaluation = new EmployeePerformanceEvaluation();
    this.displayModalSave = true;
  }

  onEditEmployeePerformanceEvaluation(editEmployeePerformanceEvaluation: EmployeePerformanceEvaluation): void {
    this.employeePerformanceEvaluation = editEmployeePerformanceEvaluation;
    this.employeePerformanceEvaluation.id = editEmployeePerformanceEvaluation.id;
    this.displayModalSave = true;
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
