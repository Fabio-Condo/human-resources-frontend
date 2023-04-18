import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IApiResponse } from 'src/app/interfaces/IApiResponse';
import { IWorkplace } from 'src/app/interfaces/IWorkplace';
import { IWorkplaceFilter } from 'src/app/interfaces/WorkplaceFilter';
import { WorkplacesService } from '../workplaces.service';

@Component({
  selector: 'app-workplaces',
  templateUrl: './workplaces.component.html',
  styleUrls: ['./workplaces.component.css']
})
export class WorkplacesComponent implements OnInit {

  totalRecords: number = 0
  workplaces: IWorkplace[] = [];

  showLoading: boolean = false;

  constructor(
    private workplacesService: WorkplacesService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getWorkplaces();
  }

  filter: IWorkplaceFilter = {
    page: 0,
    itemsPerPage: 5,
    sort: ''
  }

  getWorkplaces(): void {
    this.showLoading = true;
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

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
