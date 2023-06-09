import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { EmployeesService } from 'src/app/employees/employees.service';
import { VocationsService } from '../vocations.service';
import { IVocation } from 'src/app/core/interfaces/IVocation';
import { IVocationFilter } from 'src/app/core/interfaces/IVocationFilter';
import { HttpErrorResponse } from '@angular/common/http';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';

@Component({
  selector: 'app-vocations',
  templateUrl: './vocations.component.html',
  styleUrls: ['./vocations.component.css']
})
export class VocationsComponent implements OnInit {

  showLoading: boolean = false;

  totalRecords: number = 0

  vocations: IVocation[] = [];

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
    private vocationsService: VocationsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private employeesService: EmployeesService,
    private title: Title,
  ) { }

  ngOnInit(): void {
  }

  filter: IVocationFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'id,asc'
  }

  @ViewChild('table') grid: any;

  getVocations(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.vocationsService.findAll(this.filter).subscribe(
      (data: IApiResponse<IVocation>) => {
        this.vocations = data.content;
        this.totalRecords = data.totalElements;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );   
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.getVocations(page);
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
