import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { IJob } from 'src/app/core/interfaces/IJob';
import { IJobFilter } from 'src/app/core/interfaces/IJobFilter';
import { JobsService } from '../jobs.service';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-jobs-page',
  templateUrl: './jobs-page.component.html',
  styleUrls: ['./jobs-page.component.css']
})
export class JobsPageComponent implements OnInit {

  imagePath = './assets/meta.jpg'
  

  showLoading: boolean = false;

  totalRecords: number = 0
  jobs: IJob[] = [];

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
    private jobsService: JobsService,
    private messageService: MessageService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Jobs page');
  }

  filter: IJobFilter = {
    page: -1,
    itemsPerPage: 5,
    sort: 'id,asc'
  }

  @ViewChild('table') grid: any;

  filterJobs(page: number = 0): void {
    this.showLoading = true;
    this.filter.page++;
    this.jobsService.findAllForView(this.filter).subscribe(
      (data: IApiResponse<IJob>) => {
        this.jobs = [...this.jobs, ...data.content];
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
    this.filterJobs(page);
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }


}
