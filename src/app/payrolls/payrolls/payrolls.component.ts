import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { IEmployee } from 'src/app/core/interfaces/IEmployee';
import { IEmployeeFilter } from 'src/app/core/interfaces/IEmployeeFilter';
import { EmployeesService } from 'src/app/employees/employees.service';

@Component({
  selector: 'app-payrolls',
  templateUrl: './payrolls.component.html',
  styleUrls: ['./payrolls.component.css']
})
export class PayrollsComponent implements OnInit {

  showLoading: boolean = false;

  displayModalSave: boolean = false;

  totalRecords: number = 0
  payrolls: IEmployee[] = [];

  selectedPayrolls: IEmployee[] = [];

  displayModalFilter: boolean = false;

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
    private employeesService: EmployeesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
  ) { }

  ngOnInit(): void {
  }

  filter: IEmployeeFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'name,asc'
  }

  get editing() {
    //return Boolean(this.vocation.id);
    return true;
  }

  save(vocationForm: NgForm) {
    if (this.editing) {
      //this.update(vocationForm)
    } else {
      //this.addNew(vocationForm)
    }
  }

  filterPayrolls(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.employeesService.filter(this.filter).subscribe(
      (data: IApiResponse<IEmployee>) => {
        this.payrolls = data.content
        this.totalRecords = data.totalElements
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );   
  }

  onFilter(): void {
    this.displayModalFilter = true;
  }

  onAddNewVocation(): void {
    //this.vocation = new Vocation();
    this.displayModalSave = true;
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.filterPayrolls(page);
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
