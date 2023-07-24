import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { EmployeesService } from 'src/app/employees/employees.service';
import { VocationsService } from '../vocations.service';
import { IVocation } from 'src/app/core/interfaces/IVocation';
import { IVocationFilter } from 'src/app/core/interfaces/IVocationFilter';
import { HttpErrorResponse } from '@angular/common/http';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { Vocation } from 'src/app/core/model/Vocation';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-vocations',
  templateUrl: './vocations.component.html',
  styleUrls: ['./vocations.component.css']
})
export class VocationsComponent implements OnInit {

  selectedVocations: IVocation[] = [];
  selectedStatus: string = "";

  showLoading: boolean = false;

  totalRecords: number = 0

  vocations: IVocation[] = [];

  employees: any[] = [] ;

  vocation: IVocation = new Vocation;
  displayModalSave: boolean = false;

  selectedVocationModal: Vocation = new Vocation();
  displayModal = false;

  displayModalFilter: boolean = false;

  vocationTypes = [
    { label: 'Férias', value: 'VOCATIONS' },
    { label: 'Licença médica', value: 'SICK_LEAVE' },
    { label: 'Licença maternidade/paternidade', value: 'MATERNITY_OR_PATERNITY_LEAVE' },
    { label: 'Licença remunerada', value: 'PAID_LEAVE' },
    { label: 'Licença não remunerada', value: 'UNPAID_LEAVE' },
  ];

  vocationStatuses = [
    { label: 'APPROVED', value: 'APPROVED' },
    { label: 'PENDING', value: 'PENDING' },
    { label: 'REJECTED', value: 'REJECTED' },
  ];

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
    this.title.setTitle('Vocations page');
    this.getEmployees();
  }

  filter: IVocationFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'id,asc'
  }

  @ViewChild('table') grid: any;

  get editing() {
    return Boolean(this.vocation.id);
  }

  save(vocationForm: NgForm) {
    if (this.editing) {
      this.update(vocationForm)
    } else {
      this.addNew(vocationForm)
    }
  }

  addNew(vocationForm: NgForm) {
    this.showLoading = true;
    this.vocationsService.add(this.vocation).subscribe(
      (vocationAdded) => {
        this.vocation = vocationAdded;
        this.showLoading = false;
        this.getVocations();
        this.convertStringsToDates([vocationAdded]);
        this.messageService.add({ severity: 'success', detail: 'Vocation added successfully' });      
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(vocationForm: NgForm) {
    this.showLoading = true;
    this.vocationsService.update(this.vocation).subscribe(
      (vocation) => {
        this.vocation = vocation;
        this.getVocations();
        this.showLoading = false;
        this.convertStringsToDates([vocation]);
        this.messageService.add({ severity: 'success', detail: 'Vocation updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

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

  getEmployees() {
    return this.employeesService.findAll().subscribe(
      data => {
        this.employees = data.content.map(employee => {
          return  {
            label: employee.person.firstName + ' ' + employee.person.lastName,
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

  deleteVocation(vocation: IVocation) {
    this.vocationsService.delete(vocation.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.getVocations();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Vocation deleted succefully!' })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  deletionConfirm(vocation: IVocation): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
          this.deleteVocation(vocation);
      }
    });
  }

  severalDeleteConfirm(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir os items selecionados?',
      accept: () => {
          this.severalDelete();
      }
    });
  }

  severalStatusUpdateConfirm(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja atualizar os items selecionados?',
      accept: () => {
          this.severalStatusUpdate();
      }
    });
  }

  severalDelete(){
    this.vocationsService.severalDelete(this.selectedVocations).subscribe(
      () => {
        this.showLoading = true;
        if (this.grid.first === 0) {
          this.getVocations();
        } else {
          this.grid.reset();
        }
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Selected items deleted succefully!' })
        this.selectedVocations = [];
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  severalStatusUpdate(){
    this.vocationsService.severalStatusUpdate(this.selectedVocations, this.selectedStatus).subscribe(
      () => {
        this.showLoading = true;
        if (this.grid.first === 0) {
          this.getVocations();
        } else {
          this.grid.reset();
        }
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Selected items updated succefully!' })
        this.selectedVocations = [];
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  onFilter(): void {
    this.displayModalFilter = true;
  }

  onAddNewVocation(): void {
    this.vocation = new Vocation();
    this.displayModalSave = true;
  }

  onEditVocation(editVocation: Vocation): void {
    this.vocation = editVocation;
    this.vocation.id = editVocation.id // Not necessary
    this.convertStringsToDates([editVocation]);
    this.displayModalSave = true;
  }

  onSelectVocation(selectedVocation: IVocation): void {
    this.selectedVocationModal = selectedVocation;
    this.displayModal = true;
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.getVocations(page);
  }

  getVocationStatus(status: string) {
    switch (status) {
      case 'PENDING':
        return 'primmary';
      case 'APPROVED':
        return 'info';
      case 'REJECTED':
        return 'danger'; 
    }
    return '';
  }

  private convertStringsToDates(vocations: any[]) {
    for (const vocation of vocations) {
      vocation.beginDate = new Date(vocation.beginDate);
      vocation.endDate = new Date(vocation.endDate);
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
