import { Component, OnInit, ViewChild } from '@angular/core';
import { JobsService } from '../jobs.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { IJob } from 'src/app/core/interfaces/IJob';
import { Job } from 'src/app/core/model/Job';
import { IJobFilter } from 'src/app/core/interfaces/IJobFilter';
import { NgForm } from '@angular/forms';
import { PositionsService } from 'src/app/positions/positions.service';
import { IPosition } from 'src/app/core/interfaces/IPosition';
import { Position } from 'src/app/core/model/Position';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  showLoading: boolean = false;

  totalRecords: number = 0
  jobs: IJob[] = [];

  job: IJob = new Job;
  displayModalSave: boolean = false;

  selectedJobModal: Job = new Job();
  displayModal = false;

  positions: any[] = [] ;

  positionById: IPosition = new Position();

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
    private positionsService: PositionsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Jobs page');
    this.getPositions();
  }

  filter: IJobFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'id,asc'
  }

  @ViewChild('table') grid: any;

  get editing() {
    return Boolean(this.job.id);
  }

  save(jobForm: NgForm) {
    if (this.editing) {
      this.update(jobForm)
    } else {
      this.addNew(jobForm)
    }
  }

  addNew(jobForm: NgForm) {
    this.showLoading = true;
    this.jobsService.add(this.job).subscribe(
      (jobAdded) => {
        this.job = jobAdded;
        this.showLoading = false;
        this.filterJobs();
        this.messageService.add({ severity: 'success', detail: 'Job added successfully' });      
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(jobForm: NgForm) {
    this.showLoading = true;
    this.jobsService.update(this.job).subscribe(
      (job) => {
        this.job = job;
        this.showLoading = false;
        this.convertStringsToDates([this.job]);
        this.filterJobs();
        this.messageService.add({ severity: 'success', detail: 'Job updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  filterJobs(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.jobsService.findAll(this.filter).subscribe(
      (data: IApiResponse<IJob>) => {
        this.jobs = data.content;
        this.totalRecords = data.totalElements;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );   
  }

  deleteJob(job: IJob) {
    this.jobsService.delete(job.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.filterJobs();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Job deleted succefully!' })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getPositions() {
    return this.positionsService.findAll().subscribe(
      data => {
        this.positions = data.content.map(position => {
          return  {
            label: position.name,
            value: position.id
          }
        })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  findPositionById(id: number ) { // number
    this.showLoading = true;
    this.positionsService.getById(id).subscribe(
      position => {
        this.positionById = position;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  onAddNewJob(): void {
    this.job = new Job();
    this.displayModalSave = true;
  }

  onEditJob(editJob: Job): void {
    this.job = editJob;
    this.job.id = editJob.id
    this.convertStringsToDates([this.job]);
    this.findPositionById(editJob.position.id);
    this.displayModalSave = true;
  }

  onSelectJob(selectedJob: Job): void {
    this.selectedJobModal = selectedJob;
    this.displayModal = true;
  }

  deletionConfirm(job: IJob): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.deleteJob(job);
      }
    });
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.filterJobs(page);
  }

  private convertStringsToDates(positions: any[]) {
    for (const position of positions) {
      position.expirationDate = new Date(position.expirationDate);
      position.publicationDate = new Date(position.publicationDate);
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
