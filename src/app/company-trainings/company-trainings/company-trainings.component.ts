import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyTrainingsService } from '../company-trainings.service';
import { Title } from '@angular/platform-browser';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { EmployeesService } from 'src/app/employees/employees.service';
import { ICompanyTrainingFilter } from 'src/app/core/interfaces/ICompanyTrainingFilter';
import { ICompanyTraining } from 'src/app/core/interfaces/ICompanyTraining';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-company-trainings',
  templateUrl: './company-trainings.component.html',
  styleUrls: ['./company-trainings.component.css']
})
export class CompanyTrainingsComponent implements OnInit {

  showLoading: boolean = false;

  totalRecords: number = 0
  trainings: ICompanyTraining[] = [];

  sizePage = [
    { label: '5 itens por página', value: 5 },
    { label: '10 itens por página', value: 10 },
    { label: '25 itens por página', value: 25 },
    { label: '50 itens por página', value: 50 },
    { label: '100 itens por página', value: 100 },
  ];

  orderPage = [
    { label: 'Id (crescente)', value: 'id,asc' },
    { label: 'Id (decrescente)', value: 'id,desc' },
  ];

  constructor(
    private companyTrainingsService: CompanyTrainingsService,
    private employeesService: EmployeesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Trainings page');
  }

  @ViewChild('table') grid: any;

  filter: ICompanyTrainingFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'name,asc'
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
          this.deleteEmployee(training);
      }
    });
  }

  deleteEmployee(training: ICompanyTraining) {
    this.employeesService.delete(training.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.filterTrainings()
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Training deleted succefully!' })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.filterTrainings(page);
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
