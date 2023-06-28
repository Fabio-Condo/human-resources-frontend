import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ProvinceService } from 'src/app/provinces/provincia.service';
import { EmployeesService } from '../employees.service';
import { Contact } from 'src/app/core/model/Contact';
import { EmployeeTraining } from 'src/app/core/model/EmployeeTraining';
import { IEmployeeTraining } from 'src/app/core/interfaces/IEmployeeTraining';
import { Position } from 'src/app/core/model/Position';
import { Skill } from 'src/app/core/model/Skill';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  showLoading: boolean = false;

  totalRecords: number = 0
  employees: IEmployee[] = [];

  employee: IEmployee = new Employee;
  displayModalSave: boolean = false;

  provinces: any[] = [];
  //selectedProvince?: number;

  positions: any[] = [] ;

  contact?: Contact;
  contacts: Array<Contact> = []
  showContactForm = false;
  contactIndex?: number;

  training?: IEmployeeTraining;
  trainings: Array<IEmployeeTraining> = []
  showTrainingForm = false;
  trainingIndex?: number;

  skill?: Skill;
  skills: Array<Skill> = []
  showSkillForm = false;
  skillIndex?: number;

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

  maritalStatuses = [
    { label: 'Solteiro', value: 'SINGLE' },
    { label: 'Casado', value: 'MARRIED' },
    { label: 'Divorciado', value: 'DIVORCED' },
    { label: 'Viúvo', value: 'WIDOWER' },
  ];

  contractTypes = [
    { label: 'Indeterminado', value: 'INDEFINITE_PERIOD' },
    { label: 'Determinado', value: 'DEFINITE_PERIOD' },
    { label: 'Tempo parcial', value: 'PART_TIME' },
    { label: 'Temporário', value: 'TEMPORARY' },
    { label: 'Prestador de serviços', value: 'SERVICE_PROVIDER' },
  ];

  genders = [
    { label: 'Masculino', value: 'MASCULINE' },
    { label: 'Feminino', value: 'FEMININE' },
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
    { label: 'Cargo (crescente)', value: 'position,asc' },
    { label: 'Cargo (decrescente)', value: 'position,desc' },
    { label: 'Depart. (crescente)', value: 'department,asc' },
    { label: 'Depart. (decrescente)', value: 'department,desc' },
    { label: 'Id (crescente)', value: 'id,asc' },
    { label: 'Id (decrescente)', value: 'id,desc' },
  ];

  constructor(
    private employeesService: EmployeesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private provinceService: ProvinceService,
    private positionsService: PositionsService,
    private departmentService: DepartmentService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('employees page');
    this.getProvinces();
    this.getDepartments();
    //this.getPositions();
  }

  @ViewChild('table') grid: any;

  filter: IEmployeeFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'name,asc'
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

  addNew(employeeForm: NgForm) {
    this.showLoading = true;
    this.employeesService.add(this.employee).subscribe(
      (employeeAdded) => {
        this.employee = employeeAdded;
        this.showLoading = false;
        this.filterEmployees();
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
          this.filterEmployees()
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Employee deleted succefully!' })
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

  getProvinces() {
    this.provinceService.findAll().then(data => {
      this.provinces = data.map((province:any) => ({ 
        label: province.name,
        value: province.id 
      }));
    }),
    (errorResponse: HttpErrorResponse) => {
      this.sendErrorNotification(errorResponse.error.message);
      this.showLoading = false;
    }
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

  getPositionsByDepartmentId() {
    this.positionsService.getPositionsByDepartmentId(this.selectedDepartment!).then(list => {
      this.positions = list.map(agencia => ({
        label: agencia.name,
        value: agencia.id 
      })); 
      if (this.selectedDepartment !== this.employee.position.department.id){
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

  onFilter(): void {
    this.displayModalFilter = true;
  }

  onAddNewEmployee(): void {
    this.employee = new Employee();
    this.displayModalSave = true;
  }

  onEditEmployee(editEmployee: Employee): void {
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
    return new Contact(contact.id, contact.contactNumber, contact.name);
  }

  get editingContact() { 
    return this.contact && this.contact?.id;
  }

  removeContact(index: number) {
    this.employee.contacts.splice(index, 1);
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
    this.skill = this.cloneContact(skill);
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

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    //this.getEmployees(page);
    this.filterEmployees(page);
  }

  onSelectEmployee(selectedEmployee: IEmployee): void {
    this.selectedEmployeeModal = selectedEmployee;
    this.displayModal = true;
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
        return 'success';
      case 'APPROVED':
        return 'success'; 
      case 'PENDING':
        return 'primmary';
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
        return 'success';
    }
    return '';
  }

  getVocationStatus(status: string) {
    switch (status) {
      case 'PENDING':
        return 'primmary';
      case 'APPROVED':
        return 'success';
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
  }

  private convertStringsToDates(employees: any[]) {
    for (const employee of employees) {
      employee.birthday = new Date(employee.birthday);
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
