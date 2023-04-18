import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IApiResponse } from 'src/app/interfaces/IApiResponse';
import { IPerformanceEvaluation } from 'src/app/interfaces/IPerformanceEvaluation';
import { IPerformanceEvaluationFilter } from 'src/app/interfaces/IPerformanceEvaluationFilter';
import { PerformanceEvaluationsService } from '../performance-evaluations.service';

@Component({
  selector: 'app-performance-evaluations',
  templateUrl: './performance-evaluations.component.html',
  styleUrls: ['./performance-evaluations.component.css']
})
export class PerformanceEvaluationsComponent implements OnInit {

  totalRecords: number = 0
  performanceEvaluations: IPerformanceEvaluation[] = [];

  showLoading: boolean = false;

  constructor(
    private performanceEvaluationsService: PerformanceEvaluationsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getPerformanceEvaluations();
  }

  filter: IPerformanceEvaluationFilter = {
    page: 0,
    itemsPerPage: 5,
    sort: ''
  }

  getPerformanceEvaluations(): void {
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

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
