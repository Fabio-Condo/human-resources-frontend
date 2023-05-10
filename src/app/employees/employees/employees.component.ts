import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { DepartmentService } from 'src/app/departments/department.service';
import { IApiResponse } from 'src/app/interfaces/IApiResponse';
import { IDepartment } from 'src/app/interfaces/IDepartments';
import { IEmployee } from 'src/app/interfaces/IEmployee';
import { IEmployeeFilter } from 'src/app/interfaces/IEmployeeFilter';
import { Employee } from 'src/app/model/Employee';
import { EmployeePerformanceEvaluation } from 'src/app/model/EmployeePerformanceEvaluation';
import { PositionsService } from 'src/app/positions/positions.service';
import { ProvinceService } from 'src/app/provinces/provincia.service';
import { EmployeesService } from '../employees.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  showLoading: boolean = false;

  totalRecords: number = 0
  employees: IEmployee[] = [];

  employee: IEmployee = new Employee;
  displayModalSave: boolean = false;

  departments: any[] = [] ;

  provinces: any[] = [];
  //selectedProvince?: number;

  positions: any[] = [] ;

  showWageHistory: boolean = false;
  showEmployeePerformanceEvaluationHistory: boolean = false;

  employeePerformanceEvaluations: Array<EmployeePerformanceEvaluation> = [];
  selectedEmployeeModal: Employee = new Employee();
  displayModal = false;

  maritalStatuses = [
    { label: 'Solteiro', value: 'SINGLE' },
    { label: 'Casado', value: 'MARRIED' },
    { label: 'Divorciado', value: 'DIVORCED' },
    { label: 'Viuvo', value: 'WIDOWER' },
  ];

  genders = [
    { label: 'Masculino', value: 'MASCULINE' },
    { label: 'Feminino', value: 'FEMININE' },
  ];

  sizePage = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];

  orderPage = [
    { label: 'Nome (crescente)', value: 'name,asc' },
    { label: 'Nome (decrescente)', value: 'name,desc' },
    { label: 'Id (crescente)', value: 'id,asc' },
    { label: 'Id (decrescente)', value: 'id,desc' },
  ];

  constructor(
    private employeesService: EmployeesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private provinceService: ProvinceService,
    private departmentService: DepartmentService,
    private positionsService: PositionsService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('employees page');
    this.getProvinces();
    this.getDepartments();
    this.getPositions();
  }

  @ViewChild('table') grid: any;

  filter: IEmployeeFilter = {
    page: 0,
    itemsPerPage: 5,
    sort: 'name,asc'
  }

  get editing() {
    return Boolean(this.employee.id);
  }

  save(employeeForm: NgForm) {
    if (this.editing) {
      this.update(employeeForm)
    } else {
      this.addNew(employeeForm)
    }
  }

  addNew(employeeForm: NgForm) {
    this.showLoading = true;
    this.employeesService.add(this.employee).subscribe(
      (employeeAdded) => {
        this.employee = employeeAdded;
        this.showLoading = false;
        this.getEmployees();
        this.convertStringsToDates([employeeAdded]);
        this.messageService.add({ severity: 'success', detail: 'Employee added successfully' });      
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(employeeForm: NgForm) {
    this.showLoading = true;
    this.employeesService.update(this.employee).subscribe(
      (employee) => {
        this.employee = employee;
        this.showLoading = false;
        this.convertStringsToDates([employee]);
        this.messageService.add({ severity: 'success', detail: 'Employee updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getEmployees(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.employeesService.getEmployees(this.filter).subscribe(
      (data: IApiResponse<IEmployee>) => {
        this.employees = data.content;
        this.totalRecords = data.totalElements;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );   
  }

  deleteEmployee(employee: IEmployee) {
    this.employeesService.delete(employee.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.getEmployees();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Employee deleted succefully!' })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  deletionConfirm(employee: IEmployee): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
          this.deleteEmployee(employee);
      }
    });
  }

  getProvinces() {
    this.provinceService.findAll().then(data => {
      this.provinces = data.map((province:any) => ({ 
        label: province.name,
        value: province.id 
      }));
    }),
    (errorResponse: HttpErrorResponse) => {
      this.sendErrorNotification(errorResponse.error.message);
      this.showLoading = false;
    }
  } 

  getDepartments() {
    return this.departmentService.findAll().subscribe(
      data => {
        this.departments = data.content.map(dep => {
          return  {
            label: dep.name,
            value: dep.id
          }
        })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getPositions() {
    return this.positionsService.findAll().subscribe(
      data => {
        this.positions = data.content.map(position => {
          return  {
            label: position.name,
            value: position.id
          }
        })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  onAddNewEmployee(): void {
    this.employee = new Employee();
    this.displayModalSave = true;
  }

  onEditEmployee(editEmployee: Employee): void {
    this.convertStringsToDates([editEmployee]);
    this.employee = editEmployee;
    this.employee.id = editEmployee.id;
    this.displayModalSave = true;
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.getEmployees(page);
  }

  onSelectEmployee(selectedEmployee: IEmployee): void {
    this.selectedEmployeeModal = selectedEmployee;
    this.displayModal = true;
  }

  private convertStringsToDates(employees: any[]) {
    for (const employee of employees) {
      employee.birthday = new Date(employee.birthday);
    }
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
