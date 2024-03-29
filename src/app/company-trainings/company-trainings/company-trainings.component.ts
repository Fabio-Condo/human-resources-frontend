import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyTrainingsService } from '../company-trainings.service';
import { Title } from '@angular/platform-browser';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { EmployeesService } from 'src/app/employees/employees.service';
import { ICompanyTrainingFilter } from 'src/app/core/interfaces/ICompanyTrainingFilter';
import { ICompanyTraining } from 'src/app/core/interfaces/ICompanyTraining';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { CompanyTraining } from 'src/app/core/model/CompanyTraining';
import { CompanyTrainingTypesService } from 'src/app/company-training-types/company-training-types.service';
import { NgForm } from '@angular/forms';
import { ICompanyTrainingType } from 'src/app/core/interfaces/ICompanyTrainingType';
import { CompanyTrainingType } from 'src/app/core/model/CompanyTrainingType';
import { IEmployee } from 'src/app/core/interfaces/IEmployee';
import { Employee } from 'src/app/core/model/Employee';

@Component({
  selector: 'app-company-trainings',
  templateUrl: './company-trainings.component.html',
  styleUrls: ['./company-trainings.component.css']
})
export class CompanyTrainingsComponent implements OnInit {

  showLoading: boolean = false;

  totalCompanyTrainings: number = 0

  totalRecords: number = 0
  trainings: ICompanyTraining[] = [];

  selectedCompanyTrainingModal: CompanyTraining = new CompanyTraining();
  displayModal = false;

  companyTrainingTypes: any[] = [];

  companyTraining: ICompanyTraining = new CompanyTraining;
  displayModalSave: boolean = false;

  companyTrainingTypeById: ICompanyTrainingType = new CompanyTrainingType();

  displayModalAddNewMemberIntoTraining: boolean = false;

  employeeById: IEmployee = new Employee();
  selectedEmployeeIdToAddasMember: any;

  employees: IEmployee[] = [];
  employees2: IEmployee[] = [];
  selectedEmployees!: IEmployee[];

  displayModalFilter: boolean = false;


  showProjectMembers: boolean = false;
  showProjectMembersView: boolean = false;
  showProjectGoalsView: boolean = false;

  sizePage = [
    { label: '5 itens por página', value: 5 },
    { label: '10 itens por página', value: 10 },
    { label: '25 itens por página', value: 25 },
    { label: '50 itens por página', value: 50 },
    { label: '100 itens por página', value: 100 },
  ];

  orderPage = [
    { label: 'Date (crescente)', value: 'date,asc' },
    { label: 'Date (decrescente)', value: 'date,desc' },
  ];

  constructor(
    private companyTrainingsService: CompanyTrainingsService,
    private companyTrainingTypesService: CompanyTrainingTypesService,
    private employeesService: EmployeesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Trainings page');
    this.getCompanyTrainingTypes();
    this.getEmployees();
    this.getTotalCompanyTraining();
  }

  @ViewChild('table') grid: any;

  filter: ICompanyTrainingFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'date,asc'
  }

  get editing() {
    return Boolean(this.companyTraining.id);
  }

  save(trainingForm: NgForm) {
    if (this.editing) {
      this.update(trainingForm)
    } else {
      this.addNew(trainingForm)
    }
  }

  addNew(trainingForm: NgForm) {
    this.showLoading = true;
    this.companyTraining.employees = []
    this.companyTraining.employees = this.selectedEmployees
    this.companyTrainingsService.add(this.companyTraining).subscribe(
      (companyTrainingAdded) => {
        this.companyTraining = companyTrainingAdded;
        this.showLoading = false;
        this.filterTrainings();
        this.getTotalCompanyTraining();
        this.convertStringsToDates([companyTrainingAdded]);
        this.messageService.add({ severity: 'success', detail: 'Training added successfully' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(trainingForm: NgForm) {
    this.showLoading = true;
    this.companyTraining.employees = this.selectedEmployees
    this.companyTrainingsService.update(this.companyTraining).subscribe(
      (companyTraining) => {
        this.companyTraining = companyTraining;
        this.showLoading = false;
        this.filterTrainings();
        this.convertStringsToDates([companyTraining]);
        this.messageService.add({ severity: 'success', detail: 'Training updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  filterTrainings(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.companyTrainingsService.filter(this.filter).subscribe(
      (data: IApiResponse<ICompanyTraining>) => {
        this.trainings = data.content
        this.totalRecords = data.totalElements
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  deletionConfirm(training: ICompanyTraining): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.deleteTraining(training);
      }
    });
  }

  deleteTraining(training: ICompanyTraining) {
    this.companyTrainingsService.delete(training.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.filterTrainings()
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Training deleted succefully!' })
        this.getTotalCompanyTraining();
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getCompanyTrainingTypes() {
    return this.companyTrainingTypesService.findAll().subscribe(
      data => {
        this.companyTrainingTypes = data.content.map(trainingType => {
          return {
            label: trainingType.type,
            value: trainingType.id
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
    this.employeesService.findAllV2().then(dados => {
      this.employees = dados
    })
      .catch(
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(errorResponse.error.message);
          this.showLoading = false;
        }
      );
  }

  findTrainingById(id: any) { // number
    this.showLoading = true;
    this.companyTrainingTypesService.findById(id).subscribe(
      companyTrainingType => {
        this.companyTrainingTypeById = companyTrainingType;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
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

  getTotalCompanyTraining() {
    this.showLoading = true;
    this.companyTrainingsService.getTotal().subscribe(
      (total) => {
        this.totalCompanyTrainings = total;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  onAddEmployeeToTraining() {
    this.displayModalAddNewMemberIntoTraining = true;
  }

  removeMember(index: number) {
    this.companyTraining.employees.splice(index, 1);
    this.selectedEmployees = this.companyTraining.employees  // remove and update selected employees
  }

  onAddNewTraining(): void {
    this.companyTraining = new CompanyTraining();
    this.selectedEmployees = []
    this.displayModalSave = true;
  }

  onEditTraining(editTraining: ICompanyTraining): void {
    this.convertStringsToDates([editTraining]);
    this.companyTraining = editTraining;
    this.selectedEmployees = this.companyTraining.employees
    this.companyTraining.id = editTraining.id
    this.findTrainingById(this.companyTraining.companyTrainingType.id)
    this.displayModalSave = true;
  }

  onSelectTraining(selectedTraining: ICompanyTraining): void {
    this.selectedCompanyTrainingModal = selectedTraining;
    this.displayModal = true;
  }

  onFilter(): void {
    this.displayModalFilter = true;
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;
    this.filter.itemsPerPage = event!.rows!; // actualize a quantidade de itens por página de acordo com a opcao rowsPerPageOptions
    this.filterTrainings(page);
  }

  private convertStringsToDates(trainings: any[]) {
    for (const training of trainings) {
      training.date = new Date(training.date);
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
