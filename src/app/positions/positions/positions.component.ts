import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AdministrativeClustersService } from 'src/app/administrative-clusters/administrative-clusters.service';
import { DepartmentService } from 'src/app/departments/department.service';
import { EmployeesService } from 'src/app/employees/employees.service';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { IPosition } from 'src/app/core/interfaces/IPosition';
import { IPositionFilter } from 'src/app/core/interfaces/IPositionFilter';
import { Benefit } from 'src/app/core/model/Benefit';
import { Employee } from 'src/app/core/model/Employee';
import { MainResponsibility } from 'src/app/core/model/MainResponsibility';
import { Position } from 'src/app/core/model/Position';
import { PositionLanguages } from 'src/app/core/model/PositionLanguages';
import { ProfessionalExperience } from 'src/app/core/model/ProfessionalExperience';
import { SpecificRequirement } from 'src/app/core/model/SpecificRequirement';
import { Training } from 'src/app/core/model/Training';
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
  employees: any[] = [];

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
  professionalExperienceIndex?: number;

  benefits: Array<Benefit> = []
  showBenefitsForm = false;
  benefit?: Benefit;
  benefitIndex?: number;

  languages: Array<PositionLanguages> = []
  showLanguagesForm = false;
  language?: PositionLanguages;
  languageIndex?: number;

  positionEmployees: Array<Employee> = [];
  selectedPositionModal: Position = new Position();
  displayModal = false;

  displayModalFilter: boolean = false;

  languageWriteSpeakLevel = [
    { label: 'Fluente', value: 'FLUENT' },
    { label: 'Razoável', value: 'REASONABLE' },
  ];

  functionalGroups = [
    { label: 'Finanças e Contabilidade', value: 'FINANCE' },
    { label: 'Recursos Humanos', value: 'HUMAN_RESOURCES' },
    { label: 'Vendas e Marketing', value: 'SALES_MARKETING' },
    { label: 'Operações e Logística', value: 'LOGISTICS_OPERATIONS' },
    { label: 'Tecnologia da Informação', value: 'TI' },
    { label: 'Desenvolvimento de Produtos', value: 'DEVELOPMENT_PRODUCTS' },
    { label: 'Jurídico e Compliance', value: 'LEGAL_COMPLIANCE' },
    { label: 'Operações de Atendimento ao Cliente', value: 'CUSTOMER_SERVICE' },
    { label: 'Administração e Gerenciamento', value: 'ADMINISTRATION_MANAGEMENT' },
    { label: 'Recursos e Sustentabilidade', value: 'RESOURCES_SUSTAINABILITY' },
  ];

  sizePage = [
    { label: '5 itens por página', value: 5 },
    { label: '10 itens por página', value: 10 },
    { label: '25 itens por página', value: 25 },
    { label: '50 itens por página', value: 50 },
    { label: '100 itens por página', value: 100 },
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
    private employeesService: EmployeesService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Positions page');
    this.getDepartments();
    this.getAdministrativeClusters();
    this.getWorkplaces();
    //this.getHierarchicalReporter();
  }

  filter: IPositionFilter = {
    page: 0,
    itemsPerPage: 10,
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
        this.filterPositions();
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

  filterPositions(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.positionsService.filter(this.filter).subscribe(
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
          this.filterPositions();
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

  getHierarchicalReporter() {
    return this.employeesService.findAll().subscribe(
      data => {
        this.employees = data.content.map(employee => {
          return  {
            label: employee.name,
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

  onFilter(): void {
    this.displayModalFilter = true;
  }

  onAddNewPosition(): void {
    this.position = new Position();
    this.displayModalSave = true;
  }

  onEditPosition(editPosition: Position): void {
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
    this.specificRequirement = this.cloneSpecificRequirement(specificRequirement);
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
    this.professionalExperienceIndex = this.position.professionalExperience.length;
  }
  
  confirmProfessionalExperience(frm: NgForm) {
    this.position.professionalExperience[this.professionalExperienceIndex!] = this.cloneProfessionalExperience(this.professionalExperience!);
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
    this.professionalExperience = this.cloneProfessionalExperience(professionalExperience);
    this.showProfessionalExperienceForm = true;
    this.professionalExperienceIndex = index;
  }

  // Benefits
  openAddNewBenefitModal() {
    this.showBenefitsForm = true;
    this.benefit = new Benefit();
    this.benefitIndex = this.position.benefits.length;
  }
  
  confirmBenefit(frm: NgForm) {
    this.position.benefits[this.benefitIndex!] = this.cloneBenefit(this.benefit!);
    this.showBenefitsForm = false;
    frm.reset();
  }     
  
  cloneBenefit(benefit: Benefit): Benefit {
    return new Benefit(benefit.id, benefit.designation);
  }
  
  get editingBenefit() {  // show the title in modal
    return this.benefit && this.benefit?.id;
  }
  
  removeBenefit(index: number) {
    this.position.benefits.splice(index, 1);
    console.log("removing: " + index);
  }
  
  getReadBenefit(benefit: Benefit, index: number) {
    this.benefit = this.cloneBenefit(benefit);
    this.showBenefitsForm = true;
    this.benefitIndex = index;
  }  

  // languages
  openAddNewLanguageModal() {
    this.showLanguagesForm = true;
    this.language = new PositionLanguages();
    this.languageIndex = this.position.languages.length;
  }
  
  confirmLanguage(frm: NgForm) {
    this.position.languages[this.languageIndex!] = this.cloneLanguage(this.language!);
    this.showLanguagesForm = false;
    frm.reset();
  }     
  
  cloneLanguage(language: PositionLanguages): PositionLanguages {
    return new PositionLanguages(language.id, language.name, language.readLevel, language.writeLevel);
  }
  
  get editingLanguage() {  // show the title in modal
    return this.language && this.language?.id;
  }
  
  removeLanguage(index: number) {
    this.position.languages.splice(index, 1);
    console.log("removing: " + index);
  }
  
  getReadLanguage(language: PositionLanguages, index: number) {
    this.language = this.cloneLanguage(language);
    this.showLanguagesForm = true;
    this.languageIndex = index;
  }      

  //
  onSelectPosition(selectedPosition: IPosition): void {
    this.selectedPositionModal = selectedPosition;
    this.displayModal = true;
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.filterPositions(page);
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }
}
