import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { IEmployee } from 'src/app/core/interfaces/IEmployee';
import { IEmployeeFilter } from 'src/app/core/interfaces/IEmployeeFilter';
import { IPayRoll } from 'src/app/core/interfaces/IPayRoll';
import { IPayrollFilter } from 'src/app/core/interfaces/IPayrollFilter';
import { EmployeesService } from 'src/app/employees/employees.service';
import { PayRollService } from '../payrolls.service';
import { PayRoll } from 'src/app/core/model/PayRoll';
import { Payment } from 'src/app/core/model/Payment';
import { IPayment } from 'src/app/core/interfaces/IPayment';
import { Employee } from 'src/app/core/model/Employee';

@Component({
  selector: 'app-payrolls',
  templateUrl: './payrolls.component.html',
  styleUrls: ['./payrolls.component.css']
})
export class PayrollsComponent implements OnInit {

  showLoading: boolean = false;

  displayModalSave: boolean = false;

  totalRecords: number = 0
  payrolls: IPayRoll[] = [];

  selectedPayrolls: IPayRoll[] = [];
  selectedPayments: IPayment[] = [];

  displayModalFilter: boolean = false;

  payroll: PayRoll = new PayRoll();
  displayModal = false;

  payment: IPayment = new Payment();

  //payment?: Payment;
  payments: Array<Payment> = []
  showPaymentForm = false;
  payMentIndex?: number;

  //payment: IPayment = new Payment();

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
    private payRollService: PayRollService,
    private employeesService: EmployeesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.getEmployees(0);
  }

  filter: IPayrollFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'id,asc'
  }

  totalRecordsEmployees: number = 0
  employees: IEmployee[] = [];
  filterEmployees: IEmployeeFilter = {
    page: 0,
    itemsPerPage: 100000000,
    sort: 'id,asc'
  }

  @ViewChild('table') grid: any;

  get editing() {
    //return Boolean(this.vocation.id);
    return true;
  }

  save(vocationForm: NgForm) {
    //this.payroll.description = "Folhas de junho"
    this.showLoading = true;
    this.payroll.payments = [];
    this.payroll.payments = this.selectedPayments;
    this.payRollService.add(this.payroll).subscribe(
      (payrollAdded) => {
        this.payroll = payrollAdded;
        this.showLoading = false;
        this.filterPayrolls();
        this.convertStringsToDates([payrollAdded]);
        this.messageService.add({ severity: 'success', detail: 'Payroll added successfully' });      
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  filterPayrolls(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.payRollService.filter(this.filter).subscribe(
      (data: IApiResponse<IPayRoll>) => {
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

  getEmployees(page: number = 0): void {
    this.payroll.description
    this.showLoading = true;
    this.filterEmployees.page = page;
    this.employeesService.filter(this.filterEmployees).subscribe(
      (data: IApiResponse<IEmployee>) => {
        this.employees = data.content
        this.totalRecordsEmployees = data.totalElements
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );   
  }

  deletionConfirm(payroll: IPayRoll): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
          this.deletePayroll(payroll);
      }
    });
  }

  deletePayroll(payroll: IPayRoll) {
    this.payRollService.delete(payroll.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.filterPayrolls()
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Payroll deleted succefully!' })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  onSelectPayroll(selectedPayroll: IPayRoll): void {
    this.convertStringsToDates([selectedPayroll]);
    this.payroll = selectedPayroll;
    this.displayModal = true;
  }

  onFilter(): void {
    this.displayModalFilter = true;
  }

  onAddNewPayroll(): void {
    this.payroll = new PayRoll();
    let payments: Payment[] = this.employees.map((employee) => {  // Partindo da lista employees(Tipo Employee), crie uma outra lista do tipo Payment para depois atribuir ao Payments do novo payroll
      return { employee: employee};
    });
    this.payroll.payments = payments;
    this.displayModal = true;
  }

  confirmPayment(frm: NgForm) {
    frm.reset();
  }

  clonePayment(payment: Payment): Payment {
    return new Payment(payment.id, payment.employee);
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.filterPayrolls(page);
  }

  private convertStringsToDates(payrolls: PayRoll[]) {
    for (const payroll of payrolls) {
      payroll.referenceMonth = new Date(payroll.referenceMonth);
      payroll.releaseDate = new Date(payroll.releaseDate);
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
