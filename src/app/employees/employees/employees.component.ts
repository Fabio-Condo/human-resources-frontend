import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { DepartmentService } from 'src/app/departments/department.service';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { IEmployee } from 'src/app/core/interfaces/IEmployee';
import { IEmployeeFilter } from 'src/app/core/interfaces/IEmployeeFilter';
import { Employee } from 'src/app/core/model/Employee';
import { EmployeePerformanceEvaluation } from 'src/app/core/model/EmployeePerformanceEvaluation';
import { PositionsService } from 'src/app/positions/positions.service';
import { EmployeesService } from '../employees.service';
import { Contact } from 'src/app/core/model/Contact';
import { EmployeeTraining } from 'src/app/core/model/EmployeeTraining';
import { IEmployeeTraining } from 'src/app/core/interfaces/IEmployeeTraining';
import { Skill } from 'src/app/core/model/Skill';
import { Dependent } from 'src/app/core/model/Depedent';
import { IdCard } from 'src/app/core/model/IdCard';
import { LocationsService } from 'src/app/locations/locations.service';
import { EmployeeExperience } from 'src/app/core/model/EmployeeExperience';
import { Person } from 'src/app/core/model/Person';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  showLoading: boolean = false;
  showPdfLoading: any;

  totalEmployees: number = 0;

  totalRecords: number = 0
  employees: IEmployee[] = [];

  employee: IEmployee = new Employee;
  displayModalSave: boolean = false;

  locations: any[] = [];
  provinces: any[] = [];
  //selectedProvince?: number;

  positions: any[] = [];

  contact?: Contact;
  contacts: Array<Contact> = []
  showContactForm = false;
  contactIndex?: number;

  idCard?: IdCard;
  idCards: Array<IdCard> = []
  showIdCardForm = false;
  idCardIndex?: number;

  training?: IEmployeeTraining;
  trainings: Array<IEmployeeTraining> = []
  showTrainingForm = false;
  trainingIndex?: number;

  skill?: Skill;
  skills: Array<Skill> = []
  showSkillForm = false;
  skillIndex?: number;

  dependent?: Dependent;
  /*
  dependent: Dependent = {
    person: {
      firstName: '',
      lastName: '',
      gender: '',
      birthday: new Date()
    }
  };
  */

  dependents: Array<Dependent> = []
  showDependentForm = false;
  dependentIndex?: number;

  showWageHistory: boolean = false;
  showEmployeePerformanceEvaluationHistory: boolean = false;
  showTrainings: boolean = false;
  showContacts: boolean = false;

  employeePerformanceEvaluations: Array<EmployeePerformanceEvaluation> = [];
  selectedEmployeeModal: Employee = new Employee();
  displayModal = false;

  displayModalFilter: boolean = false;

  departments: any[] = [];
  selectedDepartment?: number;

  professionalExperience?: EmployeeExperience;
  professionalExperiences: Array<EmployeeExperience> = []
  showProfessionalExperienceForm = false;
  professionalExperienceIndex?: number;

  showContactsInfo: boolean = false;
  showIdCardsInfo: boolean = false;
  showIdCardsInfoView: boolean = false;
  showContactsInfoView: boolean = false;
  showEmployeeTrainings: boolean = false;
  showEmployeeTrainingsView: boolean = false;
  showSkills: boolean = false;
  showDependents: boolean = false;
  showDependentsView: boolean = false;
  showSkillsView: boolean = false;
  showProjects: boolean = false;
  showCompanyTrainings: boolean = false;
  showWageHistories: boolean = false;
  showEmployeePerformanceEvaluations: boolean = false;
  showVocations: boolean = false;
  showProfessionalExperiences: boolean = false;
  showProfessionalExperiencesInfoView: boolean = false;
  showMainResponsibilitiesView: boolean = false;

  // Para select de filtros
  labelGeneroPadrao: string = "Todos Generos"
  labelEstadoCivilPadrao: string = "Todos estados"
  labelTiposCargosPadrao: string = "Todos cargos"
  labelDepartamentoPadrao: string = "Todos departamentos"
  labelCargosPadrao: string = "Todos cargos"
  labelLocationPadrao: string = "Todas localizações"

  idCardsTypes = [
    { label: 'BI', value: 'ID_CARD' },
    { label: 'Passaporte', value: 'PASSPORT' },
    { label: 'Carta de Condução', value: 'DRIVER_LICENSE' },
    { label: 'Carteira de Trabalho', value: 'WORK_CARD' },
    { label: 'Carteira de Identidade Profissional', value: 'PROFESSIONAL_IDENTITY_CARD' },
  ];

  maritalStatuses = [
    { label: 'Solteiro', value: 'SINGLE' },
    { label: 'Casado', value: 'MARRIED' },
    { label: 'Divorciado', value: 'DIVORCED' },
    { label: 'Viúvo', value: 'WIDOWER' },
  ];

  positionTypes = [
    { label: 'FULL_TIME', value: 'FULL_TIME' },
    { label: 'PART_TIME', value: 'PART_TIME' },
    { label: 'FREELANCER', value: 'FREELANCER' },
    { label: 'REMOTE', value: 'REMOTE' },
    { label: 'HYBRID', value: 'HYBRID' },
    { label: 'INTERNSHIP', value: 'INTERNSHIP' },
  ];

  genders = [
    { label: 'Masculino', value: 'MASCULINE' },
    { label: 'Feminino', value: 'FEMININE' },
  ];

  RelationshipTypes = [
    { label: 'SPOUSE', value: 'SPOUSE' },
    { label: 'FATHER', value: 'FATHER' },
    { label: 'MOTHER', value: 'MOTHER' },
    { label: 'SON', value: 'SON' },
    { label: 'DAUGHTER', value: 'DAUGHTER' },
    { label: 'BROTHER', value: 'BROTHER' },
    { label: 'SISTER', value: 'SISTER' },
    { label: 'UNCLE', value: 'UNCLE' },
    { label: 'AUNT', value: 'AUNT' },
    { label: 'NEPHEW', value: 'NEPHEW' },
    { label: 'NIECE', value: 'NIECE' },
    { label: 'GRANDMOTHER', value: 'GRANDMOTHER' },
    { label: 'GRANDFATHER', value: 'GRANDFATHER' },
    { label: 'GRANDCHILD', value: 'GRANDCHILD' },
    { label: 'GRANDDAUGTHER', value: 'GRANDDAUGTHER' },
    { label: 'FATHER_IN_LAW', value: 'FATHER_IN_LAW' },
    { label: 'MOTHER_IN_LAW', value: 'MOTHER_IN_LAW' },
  ];

  sizePage = [
    { label: '5 itens por página', value: 5 },
    { label: '10 itens por página', value: 10 },
    { label: '25 itens por página', value: 25 },
    { label: '50 itens por página', value: 50 },
    { label: '100 itens por página', value: 100 },
  ];

  orderPage = [
    { label: 'Nome (crescente)', value: 'person.firstName,asc' },
    { label: 'Nome (decrescente)', value: 'person.firstName,desc' },
    { label: 'Cargo (crescente)', value: 'position,asc' },
    { label: 'Cargo (decrescente)', value: 'position,desc' },
    { label: 'Depart. (crescente)', value: 'department,asc' },
    { label: 'Depart. (decrescente)', value: 'department,desc' },
    //{ label: 'Id (crescente)', value: 'id,asc' },
    //{ label: 'Id (decrescente)', value: 'id,desc' },
  ];

  cols = [
    { field: 'person.gender', header: 'Gender' },
    { field: 'birthday', header: 'Birthday' },
    { field: 'contractType', header: 'Contract Type' },
    { field: 'wageValue', header: 'Wage' },
  ];

  _selectedColumns = this.cols;

  constructor(
    private employeesService: EmployeesService,
    private locationsService: LocationsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private positionsService: PositionsService,
    private departmentService: DepartmentService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('employees page');
    this.getDepartments();
    this.getLocations();
    this.getTotalEmployees();
    this.adicionarOpcaoPadraoDoSelectDosFiltrosParaEnums(this.labelGeneroPadrao, this.genders);
    this.adicionarOpcaoPadraoDoSelectDosFiltrosParaEnums(this.labelEstadoCivilPadrao, this.maritalStatuses);
    this.adicionarOpcaoPadraoDoSelectDosFiltrosParaEnums(this.labelTiposCargosPadrao, this.positionTypes);
    this._selectedColumns = [
      //{ field: 'gender', header: 'Gender' }
    ];

  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  @ViewChild('table') grid: any;

  filter: IEmployeeFilter = {
    gender: '',
    maritalStatus: '',
    positionType: '',
    birthplace: 0,
    department: 0,
    page: 0,
    itemsPerPage: 10,
    sort: 'person.firstName,asc'
  }

  get editing() {
    return Boolean(this.employee.id);
  }

  save(employeeForm: NgForm) {
    if (this.editing) {
      this.update(employeeForm)
    } else {
      this.addNew(employeeForm)
    }
  }

  downloadExcel() {
    this.employeesService.downloadExcelFile(this.filter).subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'funcionarios.xlsx';
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('Error occurred while downloading Excel file:', error);
      }
    );
  }


  generatePdf() {
    this.employeesService.downloadPdf(this.filter)
      .then(report => {
        const url = window.URL.createObjectURL(report);

        window.open(url);
      },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(errorResponse.message);
        }
      );
  }

  addNew(employeeForm: NgForm) {
    this.showLoading = true;
    this.employeesService.add(this.employee).subscribe(
      (employeeAdded) => {
        this.employee = employeeAdded;
        this.showLoading = false;
        this.filterEmployees();
        this.getTotalEmployees();
        this.convertStringsToDates([employeeAdded]);
        this.messageService.add({ severity: 'success', detail: 'Employee added successfully' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(employeeForm: NgForm) {
    this.showLoading = true;
    this.employeesService.update(this.employee).subscribe(
      (employee) => {
        this.employee = employee;
        this.showLoading = false;
        this.filterEmployees();
        this.convertStringsToDates([employee]);
        this.messageService.add({ severity: 'success', detail: 'Employee updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  filterEmployees(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.employeesService.filter(this.filter).subscribe(
      (data: IApiResponse<IEmployee>) => {
        this.employees = data.content
        this.totalRecords = data.totalElements
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  deleteEmployee(employee: IEmployee) {
    this.employeesService.delete(employee.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.filterEmployees();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Employee deleted succefully!' })
        this.getTotalEmployees();
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  changeStatus(employee: Employee): void {
    const novoStatus = !employee.status;
    this.employeesService.changeStatus(employee.id, novoStatus).subscribe(
      () => {
        const acao = novoStatus ? 'Activado' : 'Inactivo';
        employee.status = novoStatus;
        this.messageService.add({ severity: 'success', detail: `Funcionário ${acao} com sucesso!` });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  deletionConfirm(employee: IEmployee): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.deleteEmployee(employee);
      }
    });
  }

  getPositions() {
    return this.positionsService.findAll().subscribe(
      data => {
        this.positions = data.content.map(position => {
          return {
            label: position.name,
            value: position.id
          }
        })
        this.adicionarOpcaoPadraoDoSelectDosFiltros(this.labelCargosPadrao, this.positions);
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getPositionsByDepartmentId() {
    this.positionsService.getPositionsByDepartmentId(this.selectedDepartment!).then(list => {
      this.positions = list.map(position => ({
        label: position.name,
        value: position.id
      }));
      if (this.selectedDepartment !== this.employee.position.department.id) {
        //this.employee.position.id = 0;  
        //this.employee.position.id = undefined;         
      }
    }),
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
  }

  getDepartments() {
    return this.departmentService.findAll().subscribe(
      data => {
        this.departments = data.content.map(department => {
          return {
            label: department.name,
            value: department.id
          }
        })
        this.adicionarOpcaoPadraoDoSelectDosFiltros(this.labelDepartamentoPadrao, this.departments);
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
        this.adicionarOpcaoPadraoDoSelectDosFiltros(this.labelLocationPadrao, this.locations);
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getTotalEmployees() {
    this.showLoading = true;
    this.employeesService.getTotal().subscribe(
      (total) => {
        this.totalEmployees = total;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  onFilter(): void {
    this.adicionarOpcaoPadraoDoSelectDosFiltros(this.labelDepartamentoPadrao, this.departments);
    this.adicionarOpcaoPadraoDoSelectDosFiltros(this.labelLocationPadrao, this.locations);
    this.adicionarOpcaoPadraoDoSelectDosFiltros(this.labelCargosPadrao, this.positions);
    this.adicionarOpcaoPadraoDoSelectDosFiltrosParaEnums(this.labelGeneroPadrao, this.genders);
    this.adicionarOpcaoPadraoDoSelectDosFiltrosParaEnums(this.labelEstadoCivilPadrao, this.maritalStatuses);
    this.adicionarOpcaoPadraoDoSelectDosFiltrosParaEnums(this.labelTiposCargosPadrao, this.positionTypes);
    this.displayModalFilter = true;
  }

  onAddNewEmployee(): void {
    this.removerOpcaoPadraoDoSelectDepartamentoDosFiltros(this.labelDepartamentoPadrao);
    this.removerOpcaoPadraoDoSelectGenerosDosFiltros(this.labelGeneroPadrao);
    this.removerOpcaoPadraoDoSelectEstadoCivilDosFiltros(this.labelEstadoCivilPadrao);
    this.removerOpcaoPadraoDoSelectTipoCargoDosFiltros(this.labelTiposCargosPadrao);
    this.removerOpcaoPadraoDoSelectLocationsDosFiltros(this.labelLocationPadrao);

    this.employee = new Employee();
    this.displayModalSave = true;
  }

  onEditEmployee(editEmployee: Employee): void {
    this.removerOpcaoPadraoDoSelectDepartamentoDosFiltros(this.labelDepartamentoPadrao);
    this.removerOpcaoPadraoDoSelectGenerosDosFiltros(this.labelGeneroPadrao);
    this.removerOpcaoPadraoDoSelectEstadoCivilDosFiltros(this.labelEstadoCivilPadrao);
    this.removerOpcaoPadraoDoSelectTipoCargoDosFiltros(this.labelTiposCargosPadrao);
    this.removerOpcaoPadraoDoSelectLocationsDosFiltros(this.labelLocationPadrao);

    this.convertStringsToDates([editEmployee]);
    this.employee = editEmployee;
    this.employee.id = editEmployee.id;

    this.selectedDepartment = (this.employee.position) ? this.employee.position.department.id : undefined;
    if (this.selectedDepartment) {
      this.getPositionsByDepartmentId();
    }

    this.displayModalSave = true;
  }

  // Contacts
  getReadyNewContact() {
    this.showContactForm = true;
    this.contact = new Contact();
    this.contactIndex = this.employee.contacts.length;
  }

  getReadyContactEdit(contact: Contact, index: number) {
    this.contact = this.cloneContact(contact);
    this.showContactForm = true;
    this.contactIndex = index;
  }

  confirmContact(frm: NgForm) {
    this.employee.contacts[this.contactIndex!] = this.cloneContact(this.contact!);
    this.showContactForm = false;
    frm.reset();
  }

  cloneContact(contact: Contact): Contact {
    return new Contact(contact.id, contact.contactNumber);
  }

  get editingContact() {
    return this.contact && this.contact?.id;
  }

  removeContact(index: number) {
    this.employee.contacts.splice(index, 1);
  }

  // Id Cards
  getReadyNewIdCard() {
    this.showIdCardForm = true;
    this.idCard = new IdCard();
    this.idCardIndex = this.employee.idCards.length;
  }

  getReadyIdCardEdit(idCard: IdCard, index: number) {
    this.idCard = this.cloneIdCard(idCard);
    this.showIdCardForm = true;
    this.convertIdCardsStringsToDates([this.idCard]);
    this.idCardIndex = index;
  }

  confirmIdCard(frm: NgForm) {
    this.employee.idCards[this.idCardIndex!] = this.cloneIdCard(this.idCard!);
    this.showIdCardForm = false;
    frm.reset();
  }

  cloneIdCard(contact: IdCard): IdCard {
    return new IdCard(contact.id, contact.type, contact.idNumber, contact.issueDate);
  }

  get editingIdCard() {
    return this.idCard && this.idCard?.id;
  }

  removeIdCard(index: number) {
    this.employee.idCards.splice(index, 1);
  }

  // Training
  getReadyNewTraining() {
    this.showTrainingForm = true;
    this.training = new EmployeeTraining();
    this.trainingIndex = this.employee.employeeTrainings.length;
  }

  getReadyTrainingEdit(training: EmployeeTraining, index: number) {
    this.training = this.cloneTraining(training);
    this.showTrainingForm = true;
    this.convertTrainingStringsToDates([this.training]);
    this.trainingIndex = index;
  }

  confirmTraining(frm: NgForm) {
    this.employee.employeeTrainings[this.trainingIndex!] = this.cloneTraining(this.training!);
    this.showTrainingForm = false;
    frm.reset();
  }

  cloneTraining(training: EmployeeTraining): EmployeeTraining {
    return new EmployeeTraining(training.id, training.description, training.begin, training.end);
  }

  get editingTraining() {
    return this.training && this.training?.id;
  }

  removeTraining(index: number) {
    this.employee.employeeTrainings.splice(index, 1);
  }

  // Skills
  getReadyNewSkill() {
    this.showSkillForm = true;
    this.skill = new Skill();
    this.skillIndex = this.employee.skills.length;
  }

  getReadySkillEdit(skill: Skill, index: number) {
    this.skill = this.cloneSkill(skill);
    this.showSkillForm = true;
    this.skillIndex = index;
  }

  confirmSkill(frm: NgForm) {
    this.employee.skills[this.skillIndex!] = this.cloneSkill(this.skill!);
    this.showSkillForm = false;
    frm.reset();
  }

  cloneSkill(skill: Skill): Skill {
    return new Skill(skill.id, skill.name);
  }

  get editingSkill() {
    return this.skill && this.skill?.id;
  }

  removeSkill(index: number) {
    this.employee.skills.splice(index, 1);
  }

  // Dependents
  getReadyNewDependent() {
    this.showDependentForm = true;
    this.dependent = new Dependent(new Person(), undefined, undefined);
    this.dependentIndex = this.employee.dependents.length;
  }

  getReadyDependentEdit(dependent: Dependent, index: number) {
    this.dependent = this.cloneDependent(dependent);
    this.showDependentForm = true;
    this.convertDependentStringsToDates([this.dependent]);
    this.convertPersonStringsToDates([this.dependent.person]);
    this.dependentIndex = index;
  }

  confirmDependent(frm: NgForm) {
    this.employee.dependents[this.dependentIndex!] = this.cloneDependent(this.dependent!);
    this.showDependentForm = false;
    frm.reset();
  }

  cloneDependent(dependent: Dependent): Dependent {

    const person: Person = {
      firstName: dependent.person.firstName,
      lastName: dependent.person.lastName,
      gender: dependent.person.gender,
      birthday: dependent.person.birthday
    };

    return new Dependent(person, dependent.id, dependent.relationship);
  }

  get editingDependent() {
    return this.dependent && this.dependent?.id;
  }

  removeDependent(index: number) {
    this.employee.dependents.splice(index, 1);
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;
    //this.getEmployees(page);
    this.filterEmployees(page);
  }

  onSelectEmployee(selectedEmployee: IEmployee): void {
    this.selectedEmployeeModal = selectedEmployee;
    this.displayModal = true;
  }

  // Professional Experience
  getReadyNewProfessionalExperience() {
    this.showProfessionalExperienceForm = true;
    this.professionalExperience = new EmployeeExperience();
    this.professionalExperienceIndex = this.employee.employeeExperiences.length;
  }

  getReadyProfessionalExperienceEdit(professionalExperience: EmployeeExperience, index: number) {
    this.professionalExperience = this.cloneProfessionalExperience(professionalExperience);
    this.showProfessionalExperienceForm = true;
    this.convertTrainingStringsToDates([this.professionalExperience]);
    this.professionalExperienceIndex = index;
  }

  confirmProfessionalExperience(frm: NgForm) {
    this.employee.employeeExperiences[this.professionalExperienceIndex!] = this.cloneProfessionalExperience(this.professionalExperience!);
    this.showProfessionalExperienceForm = false;
    frm.reset();
  }

  cloneProfessionalExperience(professionalExperience: EmployeeExperience): EmployeeExperience {
    return new EmployeeExperience(professionalExperience.id, professionalExperience.description, professionalExperience.company, professionalExperience.beginDate, professionalExperience.endDate);
  }

  get editingProfessionalExperience() {
    return this.professionalExperience && this.professionalExperience?.id;
  }

  removeProfessionalExperience(index: number) {
    this.employee.employeeExperiences.splice(index, 1);
  }

  limparCampos() {
    this.filter.global = "";
    this.filter.birthplace = 0;
    this.filter.department = 0;
    this.filter.position = 0;
    this.filter.gender = "";
    this.filter.maritalStatus = "";
    this.filter.positionType = "";
    this.filter.page = 0;
    this.filter.itemsPerPage = 10;
    this.filter.sort = "person.firstName,asc"
    this.filterEmployees();
  }

  getStatus(status: boolean) {
    switch (status) {
      case true:
        return 'primmary';
      case false:
        return 'danger';
    }
    return '';
  }

  getProjectStatus(status: string) {
    switch (status) {
      case 'IN_PROGRESS':
        return 'primmary';
      case 'CONCLUDED':
        return 'info';
      case 'APPROVED':
        return 'info';
      case 'PENDING':
        return 'info';
      case 'CANCELED':
        return 'danger';
      case 'SUSPENDED':
        return 'danger';
    }
    return '';
  }

  getPerfomanceEvaluationStatus(status: string) {
    switch (status) {
      case 'YEARLY':
        return 'primmary';
      case 'MONTHLY':
        return 'info';
    }
    return '';
  }

  getVocationStatus(status: string) {
    switch (status) {
      case 'PENDING':
        return 'primmary';
      case 'APPROVED':
        return 'info';
      case 'REJECTED':
        return 'danger';
    }
    return '';
  }

  private convertTrainingStringsToDates(training: any[]) {
    for (const train of training) {
      train.begin = new Date(train.begin);
    }
    for (const train of training) {
      train.end = new Date(train.end);
    }
    for (const train of training) {
      train.beginDate = new Date(train.beginDate);
    }
    for (const train of training) {
      train.endDate = new Date(train.endDate);
    }
  }

  private convertStringsToDates(employees: any[]) {
    for (const employee of employees) {
      employee.person.birthday = new Date(employee.person.birthday);
      employee.hiringDate = new Date(employee.hiringDate);
    }
  }

  private convertDependentStringsToDates(dependents: any[]) {
    for (const dependent of dependents) {
      dependent.birthday = new Date(dependent.birthday);
    }
  }

  private convertPersonStringsToDates(people: any[]) {
    for (const person of people) {
      person.birthday = new Date(person.birthday);
    }
  }

  private convertIdCardsStringsToDates(idCards: any[]) {
    for (const idCard of idCards) {
      idCard.issueDate = new Date(idCard.issueDate);
    }
  }

  // Para Objectos o value deve ser uma string
  adicionarOpcaoPadraoDoSelectDosFiltrosParaEnums(label: string, array: any[]) {
    // Verifica se a opção padrao 'Todos...' já existe no array
    const todosOptionExists = array.some(option => option.label === label);

    // Adiciona a opção apenas se ainda não existir
    if (!todosOptionExists) {
      array.unshift({
        'label': label,
        'value': ''
      });
    }
  }

  // Para Objectos o value deve ser um numero
  adicionarOpcaoPadraoDoSelectDosFiltros(label: string, array: any[]) {
    // Verifica se a opção 'Todos funcionários' já existe no array employees
    const todosOptionExists = array.some(option => option.label === label);

    // Adiciona a opção apenas se ainda não existir
    if (!todosOptionExists) {
      array.unshift({
        'label': label,
        'value': 0
      });
    }
  }

  // Função para remover uma opção no array com base no label
  removerOpcaoPadraoDoSelectGenerosDosFiltros(labelToRemove: string) {
    this.genders = this.genders.filter(function (opcao) {
      return opcao.label !== labelToRemove;
    });
  }

  // Função para remover uma opção no array com base no label
  removerOpcaoPadraoDoSelectEstadoCivilDosFiltros(labelToRemove: string) {
    this.maritalStatuses = this.maritalStatuses.filter(function (opcao) {
      return opcao.label !== labelToRemove;
    });
  }

  // Função para remover uma opção no array com base no label
  removerOpcaoPadraoDoSelectTipoCargoDosFiltros(labelToRemove: string) {
    this.positionTypes = this.positionTypes.filter(function (opcao) {
      return opcao.label !== labelToRemove;
    });
  }

  // Função para remover uma opção no array com base no label
  removerOpcaoPadraoDoSelectDepartamentoDosFiltros(labelToRemove: string) {
    this.departments = this.departments.filter(function (opcao) {
      return opcao.label !== labelToRemove;
    });
  }

  // Função para remover uma opção no array com base no label
  removerOpcaoPadraoDoSelectLocationsDosFiltros(labelToRemove: string) {
    this.locations = this.locations.filter(function (opcao) {
      return opcao.label !== labelToRemove;
    });
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
