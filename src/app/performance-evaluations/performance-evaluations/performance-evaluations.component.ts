import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { IApiResponse } from 'src/app/interfaces/IApiResponse';
import { IPerformanceEvaluation } from 'src/app/interfaces/IPerformanceEvaluation';
import { IPerformanceEvaluationFilter } from 'src/app/interfaces/IPerformanceEvaluationFilter';
import { IPosition } from 'src/app/interfaces/IPosition';
import { PerformanceEvaluation } from 'src/app/model/PerformanceEvaluation';
import { Position } from 'src/app/model/Position';
import { PositionsService } from 'src/app/positions/positions.service';
import { SkillsService } from 'src/app/skills/skills.service';
import { PerformanceEvaluationsService } from '../performance-evaluations.service';

@Component({
  selector: 'app-performance-evaluations',
  templateUrl: './performance-evaluations.component.html',
  styleUrls: ['./performance-evaluations.component.css']
})
export class PerformanceEvaluationsComponent implements OnInit {

  showLoading: boolean = false;

  totalRecords: number = 0
  performanceEvaluations: IPerformanceEvaluation[] = [];

  performanceEvaluation: IPerformanceEvaluation = new PerformanceEvaluation;
  displayModalSave: boolean = false;

  skills: any[] = [];
  positions: any[] = [];

  postionById: IPosition = new Position();

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
    private skillsService: SkillsService,
    private positionsService: PositionsService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Performance Evaluations page');
    this.getSkills();
    this.getPositions();
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

  save(performanceEvaluationForm: NgForm) {
    if (this.editing) {
      this.update(performanceEvaluationForm)
    } else {
      this.addNew(performanceEvaluationForm)
    }
  }

  addNew(performanceEvaluationForm: NgForm) {
    this.showLoading = true;
    this.performanceEvaluationsService.add(this.performanceEvaluation).subscribe(
      (performanceEvaluationAdded) => {
        this.performanceEvaluation = performanceEvaluationAdded;
        this.showLoading = false;
        this.getPerformanceEvaluations();
        this.messageService.add({ severity: 'success', detail: 'Performance Evaluation added successfully' });      
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(positionForm: NgForm) {
    this.showLoading = true;
    this.performanceEvaluationsService.update(this.performanceEvaluation).subscribe(
      (position) => {
        this.performanceEvaluation = position;
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Performance Evaluation updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getPerformanceEvaluations(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
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

  getSkills() {
    return this.skillsService.findAll().subscribe(
      data => {
        this.skills = data.content.map(skill => {
          return  {
            label: skill.name,
            value: skill.id
          }
        })
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

  getPositionById(id: number) {
    this.showLoading = true;
    this.positionsService.getById(id).subscribe(
      position => {
        this.postionById = position;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
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
    this.getPositionById(editPerformanceEvaluation.position.id)
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
