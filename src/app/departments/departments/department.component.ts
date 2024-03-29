import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { IDepartmentFilter } from 'src/app/core/interfaces/IDepartmentFilter';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { IDepartment } from 'src/app/core/interfaces/IDepartments';
import { DepartmentService } from '../department.service';
import { NgForm } from '@angular/forms';
import { Department } from 'src/app/core/model/Department';
import { Title } from '@angular/platform-browser';
import { EmployeesService } from 'src/app/employees/employees.service';
import { Project } from 'src/app/core/model/Project';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  showLoading: boolean = false;

  totalDepartments: number = 0;

  totalRecords: number = 0
  departments: IDepartment[] = [];

  department: IDepartment = new Department;
  displayModalSave: boolean = false;

  selectedDepartmentModal: Department = new Department();
  displayModal = false;

  employeesForProjectResponsibleSelect: any[] = [];

  project?: Project;
  projects: Array<Project> = []
  showProjectForm = false;
  projectIndex?: number;

  status = [
    { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
    { label: 'CONCLUDED', value: 'CONCLUDED' },
    { label: 'PENDING', value: 'PENDING' },
    { label: 'CANCELED', value: 'CANCELED' },
    { label: 'IN_TEST', value: 'IN_TEST' },
    { label: 'APPROVED', value: 'APPROVED' },
    { label: 'SUSPENDED', value: 'SUSPENDED' },
  ];

  sizePage = [
    { label: '5 itens por página', value: 5 },
    { label: '10 itens por página', value: 10 },
    { label: '25 itens por página', value: 25 },
    { label: '50 itens por página', value: 50 },
    { label: '100 itens por página', value: 100 },
  ];

  orderPage = [
    { label: 'Nome (crescente)', value: 'name,asc' },
    { label: 'Nome (decrescente)', value: 'name,desc' },
  ];

  constructor(
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private employeesService: EmployeesService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Departments page');
    this.getTotalDepartments();
  }

  filter: IDepartmentFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'name,asc'
  }

  @ViewChild('table') grid: any;

  get editing() {
    return Boolean(this.department.id);
  }

  save(departmentForm: NgForm) {
    if (this.editing) {
      this.update(departmentForm)
    } else {
      this.addNew(departmentForm)
    }
  }

  addNew(departmentForm: NgForm) {
    this.showLoading = true;
    this.departmentService.add(this.department).subscribe(
      (departmentAdded) => {
        this.department = departmentAdded;
        this.showLoading = false;
        this.getDepartments();
        this.getTotalDepartments();
        this.messageService.add({ severity: 'success', detail: 'Department added successfully' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(departmentForm: NgForm) {
    this.showLoading = true;
    this.departmentService.update(this.department).subscribe(
      (department) => {
        this.department = department;
        this.showLoading = false;
        this.getDepartments();
        this.messageService.add({ severity: 'success', detail: 'Department updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getDepartments(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
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

  deleteDepartment(department: IDepartment) {
    this.departmentService.delete(department.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.getDepartments();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Department deleted succefully!' })
        this.getTotalDepartments();
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  deletionConfirm(department: IDepartment): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.deleteDepartment(department);
      }
    });
  }

  getTotalDepartments(){
    this.showLoading = true;
    this.departmentService.getTotal().subscribe(
      (total) => {
        this.totalDepartments =  total;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  onAddNewDepartment(): void {
    this.department = new Department();
    this.displayModalSave = true;
  }

  onEditDepartment(editDepartment: Department): void {
    this.department = editDepartment;
    this.department.id = editDepartment.id // Not necessary
    this.displayModalSave = true;
  }

  onSelectDepartment(selectedDepartment: IDepartment): void {
    this.selectedDepartmentModal = selectedDepartment;
    this.displayModal = true;
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;
    this.filter.itemsPerPage = event!.rows!; // actualize a quantidade de itens por página de acordo com a opcao rowsPerPageOptions
    this.getDepartments(page);
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
