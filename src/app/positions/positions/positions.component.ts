import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AdministrativeClustersService } from 'src/app/administrative-clusters/administrative-clusters.service';
import { DepartmentService } from 'src/app/departments/department.service';
import { IApiResponse } from 'src/app/interfaces/IApiResponse';
import { IPosition } from 'src/app/interfaces/IPosition';
import { IPositionFilter } from 'src/app/interfaces/IPositionFilter';
import { MainResponsibility } from 'src/app/model/MainResponsibility';
import { Position } from 'src/app/model/Position';
import { ProfessionalExperience } from 'src/app/model/ProfessionalExperience';
import { SpecificRequirement } from 'src/app/model/SpecificRequirement';
import { Training } from 'src/app/model/Training';
import { WorkplacesService } from 'src/app/workplaces/workplaces.service';
import { PositionsService } from '../positions.service';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css']
})
export class PositionsComponent implements OnInit {

  showLoading: boolean = false;

  totalRecords: number = 0
  positions: IPosition[] = [];

  position: IPosition = new Position;
  displayModalSave: boolean = false;

  departments: any[] = [] ;
  administrativeClusters: any[] = [] ;
  workplaces: any[] = [] ;

  mainResponsibilities: Array<MainResponsibility> = []
  showMainResponsibilityForm = false;
  mainResponsibility?: MainResponsibility;
  mainResponsibilityIndex?: number;

  specificRequirements: Array<SpecificRequirement> = []
  showSpecificRequirementForm = false;
  specificRequirement?: SpecificRequirement;
  specificRequirementIndex?: number;

  trainings: Array<Training> = []
  showTrainingForm = false;
  training?: Training;
  trainingIndex?: number;

  professionalExperiences: Array<ProfessionalExperience> = []
  showProfessionalExperienceForm = false;
  professionalExperience?: ProfessionalExperience;
  ProfessionalExperienceIndex?: number;

  sizePage = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];

  orderPage = [
    { label: 'Nome (crescente)', value: 'name,asc' },
    { label: 'Nome (decrescente)', value: 'name,desc' },
    { label: 'Id (crescente)', value: 'id,asc' },
    { label: 'Id (decrescente)', value: 'id,desc' },
  ];

  constructor(
    private positionsService: PositionsService,
    private departmentService: DepartmentService,
    private administrativeClustersService: AdministrativeClustersService,
    private workplacesService: WorkplacesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Positions page');
    this.getDepartments();
    this.getAdministrativeClusters();
    this.getWorkplaces();
  }

  filter: IPositionFilter = {
    page: 0,
    itemsPerPage: 5,
    sort: 'name,asc'
  }

  @ViewChild('table') grid: any;

  get editing() {
    return Boolean(this.position.id);
  }

  save(positionForm: NgForm) {
    if (this.editing) {
      this.update(positionForm)
    } else {
      this.addNew(positionForm)
    }
  }

  addNew(positionForm: NgForm) {
    this.showLoading = true;
    this.positionsService.add(this.position).subscribe(
      (positionAdded) => {
        this.position = positionAdded;
        this.showLoading = false;
        this.getPositions();
        this.messageService.add({ severity: 'success', detail: 'Position added successfully' });      
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(positionForm: NgForm) {
    this.showLoading = true;
    this.positionsService.update(this.position).subscribe(
      (position) => {
        this.position = position;
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Position updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getPositions(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.positionsService.getPositions(this.filter).subscribe(
      (data: IApiResponse<IPosition>) => {
        this.positions = data.content;
        this.totalRecords = data.totalElements;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );   
  }

  deletePosition(position: IPosition) {
    this.positionsService.delete(position.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.getPositions();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Position deleted succefully!' })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getDepartments() {
    return this.departmentService.findAll().subscribe(
      data => {
        this.departments = data.content.map(department => {
          return  {
            label: department.name,
            value: department.id
          }
        })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getAdministrativeClusters() {
    return this.administrativeClustersService.findAll().subscribe(
      data => {
        this.administrativeClusters = data.content.map(administrativeCluster => {
          return  {
            label: administrativeCluster.name,
            value: administrativeCluster.id
          }
        })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getWorkplaces() {
    return this.workplacesService.findAll().subscribe(
      data => {
        this.workplaces = data.content.map(workplace => {
          return  {
            label: workplace.name,
            value: workplace.id
          }
        })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  onAddNewPosition(): void {
    this.position = new Position();
    this.displayModalSave = true;
  }

  onEditDepartment(editPosition: Position): void {
    this.position = editPosition;
    this.position.id = editPosition.id
    this.displayModalSave = true;
  }

  deletionConfirm(position: IPosition): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.deletePosition(position);
      }
    });
  }

  // Main Responsabilities
  openAddNewMainResponsabilityModal() {
    this.showMainResponsibilityForm = true;
    this.mainResponsibility = new MainResponsibility();
    this.mainResponsibilityIndex = this.position.mainResponsibilities.length;
  }

  confirmMainResponsability(frm: NgForm) {
    this.position.mainResponsibilities[this.mainResponsibilityIndex!] = this.cloneMainResponsability(this.mainResponsibility!);
    this.showMainResponsibilityForm = false;
    frm.reset();
  }     

  cloneMainResponsability(mainResponsability: MainResponsibility): MainResponsibility {
    return new MainResponsibility(mainResponsability.id, mainResponsability.designation);
  }

  get editingMainResponsability() {  // show the title in modal
    return this.mainResponsibility && this.mainResponsibility?.id;
  }

  removeMainResponsability(index: number) {
    this.position.mainResponsibilities.splice(index, 1);
    console.log("removing: " + index);
  }

  getReadEditintMainResponsability(mainResponsability: MainResponsibility, index: number) {
    this.mainResponsibility = this.cloneMainResponsability(mainResponsability);
    this.showMainResponsibilityForm = true;
    this.mainResponsibilityIndex = index;
  }

  // Specific Requirements
  openAddNewSpecificRequirementModal() {
    this.showSpecificRequirementForm = true;
    this.specificRequirement = new SpecificRequirement();
    this.specificRequirementIndex = this.position.specificRequirements.length;
  }

  confirmSpecificRequirement(frm: NgForm) {
    this.position.specificRequirements[this.specificRequirementIndex!] = this.cloneSpecificRequirement(this.specificRequirement!);
    this.showSpecificRequirementForm = false;
    frm.reset();
  }     

  cloneSpecificRequirement(specificRequirement: SpecificRequirement): SpecificRequirement {
    return new SpecificRequirement(specificRequirement.id, specificRequirement.designation);
  }

  get editingSpecificRequirement() {  // show the title in modal
    return this.specificRequirement && this.specificRequirement?.id;
  }

  removeSpecificRequirement(index: number) {
    this.position.specificRequirements.splice(index, 1);
    console.log("removing: " + index);
  }

  getReadEditSpecificRequirement(specificRequirement: SpecificRequirement, index: number) {
    this.specificRequirement = this.cloneMainResponsability(specificRequirement);
    this.showSpecificRequirementForm = true;
    this.specificRequirementIndex = index;
  }

  // Training
  openAddNewTrainingModal() {
    this.showTrainingForm = true;
    this.training = new Training();
    this.trainingIndex = this.position.training.length;
  }

  confirmTraining(frm: NgForm) {
    this.position.training[this.trainingIndex!] = this.cloneTraining(this.training!);
    this.showTrainingForm = false;
    frm.reset();
  }     

  cloneTraining(training: Training): Training {
    return new Training(training.id, training.designation);
  }

  get editingTraining() {  // show the title in modal
    return this.training && this.training?.id;
  }

  removeTraining(index: number) {
    this.position.training.splice(index, 1);
    console.log("removing: " + index);
  }

  getReadTraining(training: Training, index: number) {
    this.training = this.cloneTraining(training);
    this.showTrainingForm = true;
    this.trainingIndex = index;
  }

  // ProfessionalExperience
  openAddNewProfessionalExperienceModal() {
    this.showProfessionalExperienceForm = true;
    this.professionalExperience = new Training();
    this.ProfessionalExperienceIndex = this.position.professionalExperience.length;
  }
  
  confirmProfessionalExperience(frm: NgForm) {
    this.position.professionalExperience[this.ProfessionalExperienceIndex!] = this.cloneTraining(this.professionalExperience!);
    this.showProfessionalExperienceForm = false;
    frm.reset();
  }     
  
  cloneProfessionalExperience(professionalExperience: ProfessionalExperience): ProfessionalExperience {
    return new ProfessionalExperience(professionalExperience.id, professionalExperience.designation);
  }
  
  get editingProfessionalExperience() {  // show the title in modal
    return this.professionalExperience && this.professionalExperience?.id;
  }
  
  removeProfessionalExperience(index: number) {
    this.position.professionalExperience.splice(index, 1);
    console.log("removing: " + index);
  }
  
  getReadProfessionalExperience(professionalExperience: ProfessionalExperience, index: number) {
    this.professionalExperience = this.cloneTraining(professionalExperience);
    this.showProfessionalExperienceForm = true;
    this.ProfessionalExperienceIndex = index;
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.getPositions(page);
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }
}
