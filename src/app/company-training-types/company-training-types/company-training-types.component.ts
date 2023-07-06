import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { CompanyTrainingTypesService } from '../company-training-types.service';
import { ICompanyTrainingType } from 'src/app/core/interfaces/ICompanyTrainingType';
import { ICompanyTrainingTypeFilter } from 'src/app/core/interfaces/ICompanyTrainingTypeFilter';
import { NgForm } from '@angular/forms';
import { CompanyTrainingType } from 'src/app/core/model/CompanyTrainingType';
import { CompanyTrainingTypeGoal } from 'src/app/core/model/CompanyTrainingTypeGoal';

@Component({
  selector: 'app-company-training-types',
  templateUrl: './company-training-types.component.html',
  styleUrls: ['./company-training-types.component.css']
})
export class CompanyTrainingTypesComponent implements OnInit {

  showLoading: boolean = false;

  totalRecords: number = 0
  trainingTypes: ICompanyTrainingType[] = [];

  trainingType: ICompanyTrainingType = new CompanyTrainingType;
  displayModalSave: boolean = false;

  selectedTrainingTypeModal: CompanyTrainingType = new CompanyTrainingType();
  displayModal = false;

  goal?: CompanyTrainingTypeGoal;
  goals: Array<CompanyTrainingTypeGoal> = []
  showGoalForm = false;
  goalIndex?: number;

  showTrainingGoals: boolean = false;
  showProjectGoalsView: boolean = false;

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
    private companyTrainingTypesService: CompanyTrainingTypesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Training types page');
  }

  @ViewChild('table') grid: any;

  filter: ICompanyTrainingTypeFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'id,asc'
  }

  get editing() {
    return Boolean(this.trainingType.id);
  }

  save(trainingTypeForm: NgForm) {
    if (this.editing) {
      this.update(trainingTypeForm)
    } else {
      this.addNew(trainingTypeForm)
    }
  }

  addNew(trainingTypeForm: NgForm) {
    this.showLoading = true;
    this.companyTrainingTypesService.add(this.trainingType).subscribe(
      (trainingTypeAdded) => {
        this.trainingType = trainingTypeAdded;
        this.showLoading = false;
        this.filterTrainingTypes();
        this.messageService.add({ severity: 'success', detail: 'Training type added successfully' });      
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(trainingTypeForm: NgForm) {
    this.showLoading = true;
    this.companyTrainingTypesService.update(this.trainingType).subscribe(
      (trainingType) => {
        this.trainingType = trainingType;
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Training type updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }


  filterTrainingTypes(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.companyTrainingTypesService.filter(this.filter).subscribe(
      (data: IApiResponse<ICompanyTrainingType>) => {
        this.trainingTypes = data.content
        this.totalRecords = data.totalElements
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );   
  }

  deleteTrainingType(trainingType: ICompanyTrainingType) {
    this.companyTrainingTypesService.delete(trainingType.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.filterTrainingTypes();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Training type deleted succefully!' })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  deletionConfirm(trainingType: ICompanyTrainingType): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
          this.deleteTrainingType(trainingType);
      }
    });
  }

  onAddNewTrainingType(): void {
    this.trainingType = new CompanyTrainingType();
    this.displayModalSave = true;
  }

  onEditTrainingType(editTrainingType: CompanyTrainingType): void {
    this.trainingType = editTrainingType;
    this.trainingType.id = editTrainingType.id // Not necessary
    this.displayModalSave = true;
  }

  onSelectTrainingType(selectedTrainingType: ICompanyTrainingType): void {
    this.selectedTrainingTypeModal = selectedTrainingType;
    this.displayModal = true;
  }

  // Goals
  getReadyNewGoal() {
    this.showGoalForm = true;
    this.goal = new CompanyTrainingTypeGoal();
    this.goalIndex = this.trainingType.companyTrainingTypeGoals.length;
  }

  getReadyGoalEdit(goal: CompanyTrainingTypeGoal, index: number) {
    this.goal = this.cloneGoal(goal);
    this.showGoalForm = true;
    this.goalIndex = index;
  }

  confirmGoal(frm: NgForm) {
    this.trainingType.companyTrainingTypeGoals[this.goalIndex!] = this.cloneGoal(this.goal!);
    this.showGoalForm = false;
    frm.reset();
  }

  cloneGoal(goal: CompanyTrainingTypeGoal): CompanyTrainingTypeGoal {
    return new CompanyTrainingTypeGoal(goal.id, goal.designation);
  }

  get editingGoal() { 
    return this.goal && this.goal?.id;
  }

  removeGoal(index: number) {
    this.trainingType.companyTrainingTypeGoals.splice(index, 1);
  }
  //

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.filterTrainingTypes(page);
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
