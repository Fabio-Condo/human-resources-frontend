import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { Title } from '@angular/platform-browser';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { DepartmentService } from 'src/app/departments/department.service';
import { EmployeesService } from 'src/app/employees/employees.service';
import { IPositionFilter } from 'src/app/core/interfaces/IPositionFilter';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { IProject } from 'src/app/core/interfaces/IProject';
import { HttpErrorResponse } from '@angular/common/http';
import { Project } from 'src/app/core/model/Project';
import { NgForm } from '@angular/forms';
import { IProjectFilter } from 'src/app/core/interfaces/IProjectFilter';
import { IEmployee } from 'src/app/core/interfaces/IEmployee';
import { Employee } from 'src/app/core/model/Employee';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  showLoading: boolean = false;
  totalRecords: number = 0

  projects: IProject[] = [];

  project: IProject = new Project;
  displayModalSave: boolean = false;

  departments: any[] = [] ;
  employees: any[] = [] ;

  selectedEmployeeIdToAddasMember: any;

  displayModalAddNewMemberIntoProject: boolean = false;
  displayModalFilter: boolean = false;

  selectedProjectModal: Project = new Project();
  displayModal = false;

  employeeById: IEmployee = new Employee();

  showProjectMembers: boolean = false;

  projectStatuses = [
    { label: 'Em andamento', value: 'IN_PROGRESS' },
    { label: 'Concluído', value: 'CONCLUDED' },
    { label: 'Pendente', value: 'PENDING' },
    { label: 'Cancelado', value: 'CANCELED' },
    { label: 'Em teste', value: 'IN_TEST' },
    { label: 'Aprovado', value: 'APPROVED' },
    { label: 'Suspenso', value: 'SUSPENDED' },
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
    { label: 'Id (crescente)', value: 'id,asc' },
    { label: 'Id (decrescente)', value: 'id,desc' },
  ];

  constructor(
    private projectSerice: ProjectsService,
    private departmentService: DepartmentService,
    private employeesService: EmployeesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Projects page');
    this.getDepartments();
    this.getEmployees();
  }

  filter: IProjectFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'name,asc'
  }

  @ViewChild('table') grid: any;

  get editing() {
    return Boolean(this.project.id);
  }  
  
  save(projectForm: NgForm) {
    if (this.editing) {
      this.update(projectForm)
    } else {
      this.addNew(projectForm)
    }
  }

  addNew(projectForm: NgForm) {
    this.showLoading = true;
    this.projectSerice.add(this.project).subscribe(
      (projectAdded) => {
        this.project = projectAdded;
        this.showLoading = false;
        this.filterProjects();
        this.messageService.add({ severity: 'success', detail: 'Project added successfully' });      
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(projectForm: NgForm) {
    this.showLoading = true;
    this.projectSerice.update(this.project).subscribe(
      (project) => {
        this.project = project;
        this.filterProjects();
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Project updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }


  filterProjects(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.projectSerice.filter(this.filter).subscribe(
      (data: IApiResponse<IProject>) => {
        this.projects = data.content;
        this.totalRecords = data.totalElements;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );   
  }

  getDepartments() {
    return this.departmentService.findAll().subscribe(
      data => {
        this.departments = data.content.map(department => {
          return  {
            label: department.name,
            value: department.id
          }
        })
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

  findEmployeeById(id: number) {
    this.showLoading = true;
    this.employeesService.findById(id).subscribe(
      employee => {
        this.employeeById = employee;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  deleteProject(project: IProject) {
    this.projectSerice.delete(project.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.filterProjects();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Workplace deleted succefully!' })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  onaddEmployeeToProject(){
    this.displayModalAddNewMemberIntoProject = true;
  }

  addEmployeeToProject(employeeId: number) {
    this.projectSerice.addEmployeeToProject(employeeId, this.project.id).subscribe(
      (project) => {
        this.filterProjects();
        this.project = project;
        this.messageService.add({ severity: 'success', detail: 'Employee added successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
      }
    )
  }

  removeEmployeeProject(employeeId: number) {
    this.projectSerice.removeEmployeeProject(employeeId, this.project.id).subscribe(
      (project) => {
        this.filterProjects();
        this.project = project;
        this.messageService.add({ severity: 'success', detail: 'Employee removed successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
      }
    )
  }

  removeEmployeeProjectConfirm(employeeId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete remove this member?',
      accept: () => {
        this.removeEmployeeProject(employeeId);
      }
    });
  }

  onSelectProject(selectedProject: IProject): void {
    this.selectedProjectModal = selectedProject;
    this.displayModal = true;
  }

  onFilter(): void {
    this.displayModalFilter = true;
  }

  onAddNewProject(): void {
    this.project = new Project();
    this.displayModalSave = true;
  }

  onEditProject(editProject: Project): void {
    this.project = editProject;
    this.project.id = editProject.id
    this.displayModalSave = true;
  }

  deletionConfirm(project: IProject): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.deleteProject(project);
      }
    });
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.filterProjects(page);
  }

  getProjectStatus(status: string) {
    switch (status) {
      case 'IN_PROGRESS':
        return 'primmary';
      case 'CONCLUDED':
        return 'info';
      case 'APPROVED':
        return 'info'; 
      case 'PENDING':
        return 'primmary';
      case 'CANCELED':
        return 'danger'; 
      case 'SUSPENDED':
        return 'danger'; 
    }
    return '';
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
