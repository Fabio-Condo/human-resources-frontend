import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
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
import { SpecificRequirement } from 'src/app/core/model/SpecificRequirement';
import { PositionsService } from '../positions.service';
import { LocationsService } from 'src/app/locations/locations.service';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css']
})
export class PositionsComponent implements OnInit {

  showLoading: boolean = false;

  totalPositions: number = 0

  totalRecords: number = 0
  positions: IPosition[] = [];

  position: IPosition = new Position;
  displayModalSave: boolean = false;

  departments: any[] = [];
  administrativeClusters: any[] = [];
  locations: any[] = [];
  employees: any[] = [];

  mainResponsibilities: Array<MainResponsibility> = []
  showMainResponsibilityForm = false;
  mainResponsibility?: MainResponsibility;
  mainResponsibilityIndex?: number;

  specificRequirements: Array<SpecificRequirement> = []
  showSpecificRequirementForm = false;
  specificRequirement?: SpecificRequirement;
  specificRequirementIndex?: number;

  benefits: Array<Benefit> = []
  showBenefitsForm = false;
  benefit?: Benefit;
  benefitIndex?: number;

  positionEmployees: Array<Employee> = [];
  selectedPositionModal: Position = new Position();
  displayModal = false;

  displayModalFilter: boolean = false;

  showMainResponsibilities: boolean = false;
  showSpecificRequirements: boolean = false;
  showBenefits: boolean = false;
  showMainResponsibilitiesView: boolean = false;
  showSpecificRequirementsView: boolean = false;
  showBenefitsView: boolean = false;
  showEmployeesView: boolean = false;

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

  positionTypes = [
    { label: 'Tempo inteiro', value: 'FULL_TIME' },
    { label: 'Tempo parcial', value: 'PART_TIME' },
    { label: 'Freelancer', value: 'FREELANCER' },
    { label: 'Remoto', value: 'REMOTE' },
    { label: 'Hibrida', value: 'HYBRID' },
    { label: 'Estágio', value: 'INTERNSHIP' },
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
  ];

  constructor(
    private positionsService: PositionsService,
    private departmentService: DepartmentService,
    private locationsService: LocationsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private employeesService: EmployeesService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Positions page');
    this.getDepartments();
    this.getLocations();
    this.getTotalPositions();
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
        this.getTotalPositions();
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
        this.filterPositions();
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
        this.getTotalPositions();
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
          return {
            label: this.limitarString(department.name, 30),
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

  getLocations() {
    return this.locationsService.findAll().subscribe(
      data => {
        this.locations = data.content.map(location => {
          return {
            label: location.name + ", (" + location.country.name + ")",
            value: location.id
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
          return {
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

  getTotalPositions() {
    this.showLoading = true;
    this.positionsService.getTotal().subscribe(
      (total) => {
        this.totalPositions = total;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  limitarString(texto: string, limite: number): string {
    if (texto.length <= limite) {
      return texto;
    } else {
      return texto.slice(0, limite) + "...";
    }
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

  //
  onSelectPosition(selectedPosition: IPosition): void {
    this.selectedPositionModal = selectedPosition;
    this.displayModal = true;
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;
    this.filter.itemsPerPage = event!.rows!; // actualize a quantidade de itens por página de acordo com a opcao rowsPerPageOptions
    this.filterPositions(page);
  }

  getPositioValue(status: string) {
    switch (status) {
      case 'FULL_TIME':
        return 'Tempo inteiro';
      case 'PART_TIME':
        return 'Tempo parcial';
      case 'FREELANCER':
        return 'Freelancer';
      case 'REMOTE':
        return 'Remoto';
      case 'HYBRID':
        return 'Hibrida';
      case 'INTERNSHIP':
        return 'Estágio';
    }
    return '';
  }

  getPosition(status: string) {
    switch (status) {
      case 'FULL_TIME':
        return 'primmary';
      case 'PART_TIME':
        return 'success';
      case 'FREELANCER':
        return 'info';
      case 'REMOTE':
        return 'primmary';
      case 'HYBRID':
        return 'warning';
      case 'INTERNSHIP':
        return 'info';
    }
    return '';
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }
}
