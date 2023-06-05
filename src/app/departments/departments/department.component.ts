import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { IDepartmentFilter } from 'src/app/core/interfaces/IDepartmentFilter';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { IDepartment } from 'src/app/core/interfaces/IDepartments';
import { DepartmentService } from '../department.service';
import { NgForm } from '@angular/forms';
import { Department } from 'src/app/core/model/Department';
import { Title } from '@angular/platform-browser';
import { Employee } from 'src/app/core/model/Employee';
import { IEmployee } from 'src/app/core/interfaces/IEmployee';
import { EmployeesService } from 'src/app/employees/employees.service';
import { SerializedEmployeeExcludePositition } from 'src/app/core/model/SerializedEmployeeExcludePositition';
import { ISerializedEmployeeExcludePositition } from 'src/app/core/interfaces/ISerializedEmployeeExcludePositition';
import { Project } from 'src/app/core/model/Project';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  showLoading: boolean = false;

  totalRecords: number = 0
  departments: IDepartment[] = [];

  department: IDepartment = new Department;
  displayModalSave: boolean = false;

  employees: Array<Employee> = [];
  selectedDepartmentModal: Department = new Department();
  displayModal = false;

  employeesForProjectResponsibleSelect: any[] = [] ;

  project?: Project;
  projects: Array<Project> = []
  showProjectForm = false;
  projectIndex?: number;

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
    { label: 'Id (crescente)', value: 'id,asc' },
    { label: 'Id (decrescente)', value: 'id,desc' },
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
    this.getEmployees();
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
        this.employeesForProjectResponsibleSelect = data.content.map(employee => {
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

  deletionConfirm(department: IDepartment): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
          this.deleteDepartment(department);
      }
    });
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
    this.getDepartments(page);
  }

  // Project crud table
  getReadyNewProject() {
    this.showProjectForm = true;
    this.project = new Project();
    this.projectIndex = this.department.projects.length;
  }

  getReadyProjectEdit(project: Project, index: number) {
    this.project = this.cloneProject(project);
    this.showProjectForm = true;
    this.projectIndex = index;
  }

  confirmProject(frm: NgForm) {
    this.department.projects[this.projectIndex!] = this.cloneProject(this.project!);
    this.showProjectForm = false;
    //frm.reset();
  }

  cloneProject(project: Project): Project {
    return new Project(project.id, project.name, project.responsibleEmployee);
  }

  get editingProject() { 
    return this.project && this.project?.id;
  }
  // End project

  removeProject(index: number) {
    this.department.projects.splice(index, 1);
    console.log("removing: " + index);
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
