import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { IApiResponse } from 'src/app/interfaces/IApiResponse';
import { IPerformanceEvaluation } from 'src/app/interfaces/IPerformanceEvaluation';
import { IPerformanceEvaluationFilter } from 'src/app/interfaces/IPerformanceEvaluationFilter';
import { PerformanceEvaluation } from 'src/app/model/PerformanceEvaluation';
import { PerformanceEvaluationsService } from '../performance-evaluations.service';

@Component({
  selector: 'app-performance-evaluations',
  templateUrl: './performance-evaluations.component.html',
  styleUrls: ['./performance-evaluations.component.css']
})
export class PerformanceEvaluationsComponent implements OnInit {

  totalRecords: number = 0
  performanceEvaluations: IPerformanceEvaluation[] = [];

  performanceEvaluation: IPerformanceEvaluation = new PerformanceEvaluation;
  displayModalSave: boolean = false;

  showLoading: boolean = false;

  sizePage = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];

  orderPage = [
    { label: 'Proficiency Level (crescente)', value: 'proficiencyLevel,asc' },
    { label: 'Proficiency Level (decrescente)', value: 'proficiencyLevel,desc' },
    { label: 'Id (crescente)', value: 'id,asc' },
    { label: 'Id (decrescente)', value: 'id,desc' },
  ];

  constructor(
    private performanceEvaluationsService: PerformanceEvaluationsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Performance Evaluations page');
  }

  filter: IPerformanceEvaluationFilter = {
    page: 0,
    itemsPerPage: 5,
    sort: 'proficiencyLevel,asc'
  }

  @ViewChild('table') grid: any;

  get editing() {
    return Boolean(this.performanceEvaluation.id);
  }

  save(performanceEvaluationForm: NgForm){

  }

  getPerformanceEvaluations(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.showLoading = true;
    this.performanceEvaluationsService.getPerformanceEvaluations(this.filter).subscribe(
      (data: IApiResponse<IPerformanceEvaluation>) => {
        this.performanceEvaluations = data.content;
        this.totalRecords = data.totalElements;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );   
  }

  deletePerformanceEvaluations(performanceEvaluation: IPerformanceEvaluation) {
    this.performanceEvaluationsService.delete(performanceEvaluation.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.getPerformanceEvaluations();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Performance Evaluation deleted succefully!' })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  deletionConfirm(performanceEvaluation: IPerformanceEvaluation): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.deletePerformanceEvaluations(performanceEvaluation);
      }
    });
  }

  onAddNewPerformanceEvaluation(): void {
    this.performanceEvaluation = new PerformanceEvaluation();
    this.displayModalSave = true;
  }

  onEditPerformanceEvaluation(editPerformanceEvaluation: PerformanceEvaluation): void {
    this.performanceEvaluation = editPerformanceEvaluation;
    this.performanceEvaluation.id = editPerformanceEvaluation.id
    this.displayModalSave = true;
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.getPerformanceEvaluations(page);
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
