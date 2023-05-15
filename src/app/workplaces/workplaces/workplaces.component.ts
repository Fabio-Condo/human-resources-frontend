import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { IWorkplace } from 'src/app/core/interfaces/IWorkplace';
import { IWorkplaceFilter } from 'src/app/core/interfaces/IWorkplaceFilter';
import { Workplace } from 'src/app/core/model/Workplace';
import { WorkplacesService } from '../workplaces.service';

@Component({
  selector: 'app-workplaces',
  templateUrl: './workplaces.component.html',
  styleUrls: ['./workplaces.component.css']
})
export class WorkplacesComponent implements OnInit {

  showLoading: boolean = false;

  totalRecords: number = 0
  workplaces: IWorkplace[] = [];

  workplace: IWorkplace = new Workplace;
  displayModalSave: boolean = false;

  sizePage = [
    { label: '5 por página', value: 5 },
    { label: '10 por página', value: 10 },
    { label: '25 por página', value: 25 },
    { label: '50 por página', value: 50 },
    { label: '100 por página', value: 100 },
  ];

  orderPage = [
    { label: 'Nome (crescente)', value: 'name,asc' },
    { label: 'Nome (decrescente)', value: 'name,desc' },
    { label: 'Id (crescente)', value: 'id,asc' },
    { label: 'Id (decrescente)', value: 'id,desc' },
  ];

  constructor(
    private workplacesService: WorkplacesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Workplaces page');
  }

  filter: IWorkplaceFilter = {
    page: 0,
    itemsPerPage: 5,
    sort: 'name,asc'
  }

  @ViewChild('table') grid: any;

  get editing() {
    return Boolean(this.workplace.id);
  }

  save(workplaceForm: NgForm) {
    if (this.editing) {
      this.update(workplaceForm)
    } else {
      this.addNew(workplaceForm)
    }
  }

  addNew(workplaceForm: NgForm) {
    this.showLoading = true;
    this.workplacesService.add(this.workplace).subscribe(
      (workplaceAdded) => {
        this.workplace = workplaceAdded;
        this.showLoading = false;
        this.getWorkplaces();
        this.messageService.add({ severity: 'success', detail: 'Workplace added successfully' });      
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(workplaceForm: NgForm) {
    this.showLoading = true;
    this.workplacesService.update(this.workplace).subscribe(
      (workplace) => {
        this.workplace = workplace;
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Workplace updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getWorkplaces(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.workplacesService.getWorkplaces(this.filter).subscribe(
      (data: IApiResponse<IWorkplace>) => {
        this.workplaces = data.content;
        this.totalRecords = data.totalElements;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );   
  }

  deleteWorkplace(workplace: IWorkplace) {
    this.workplacesService.delete(workplace.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.getWorkplaces();
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

  onAddNewWorkplace(): void {
    this.workplace = new Workplace();
    this.displayModalSave = true;
  }

  onEditWorkplace(editWorkplace: Workplace): void {
    this.workplace = editWorkplace;
    this.workplace.id = editWorkplace.id
    this.displayModalSave = true;
  }

  deletionConfirm(workplace: IWorkplace): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.deleteWorkplace(workplace);
      }
    });
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.getWorkplaces(page);
  }
  
  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
