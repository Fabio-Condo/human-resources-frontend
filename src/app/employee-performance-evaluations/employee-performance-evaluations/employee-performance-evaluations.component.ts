import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { EmployeesService } from 'src/app/employees/employees.service';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { IEmployeePerformanceEvaluation } from 'src/app/core/interfaces/IEmployeePerformanceEvaluation';
import { IEmployeePerformanceEvaluationFilter } from 'src/app/core/interfaces/IEmployeePerformanceEvaluationFilter';
import { EmployeePerformanceEvaluation } from 'src/app/core/model/EmployeePerformanceEvaluation';
import { EmployeePerformanceEvaluationsService } from '../employee-performance-evaluations.service';
import { DepartmentService } from 'src/app/departments/department.service';
import { PositionsService } from 'src/app/positions/positions.service';

@Component({
  selector: 'app-employee-performance-evaluations',
  templateUrl: './employee-performance-evaluations.component.html',
  styleUrls: ['./employee-performance-evaluations.component.css']
})
export class EmployeePerformanceEvaluationsComponent implements OnInit {

  selectedEmployeePerformanceEvaluations: IEmployeePerformanceEvaluation[] = [];
  selectedStatus: string = "";

  showLoading: boolean = false;

  totalEmployeePerformanceEvaluations: number = 0;

  totalRecords: number = 0
  employeePerformanceEvaluations: IEmployeePerformanceEvaluation[] = [];

  employeePerformanceEvaluation: IEmployeePerformanceEvaluation = new EmployeePerformanceEvaluation;
  displayModalSave: boolean = false;

  employees: any[] = [];

  departments: any[] = [];
  positions: any[] = [];

  displayModalFilter: boolean = false;

  selectedEmployeePerformanceEvaluationModal: EmployeePerformanceEvaluation = new EmployeePerformanceEvaluation();
  displayModal = false;

  // Para select de filtros
  labelFuncionarioPadrao: string = "Todos funcionários"
  labelCategoriaPadrao: string = "Todas categorias"
  labelDepartamentoPadrao: string = "Todos departamentos"
  labelCargosPadrao: string = "Todos cargos"

  categories = [
    { label: 'YEARLY', value: 'YEARLY' },
    { label: 'MONTHLY', value: 'MONTHLY' },
  ];

  evaluationLevels = [
    { label: 'Um [1]', value: 'ONE' },
    { label: 'Dois [2]', value: 'TWO' },
    { label: 'Três [3]', value: 'THREE' },
    { label: 'Quatro [4]', value: 'FOUR' },
    { label: 'Cinco [5]', value: 'FIVE' },
  ];

  sizePage = [
    { label: '5 itens por página', value: 5 },
    { label: '10 itens por página', value: 10 },
    { label: '25 itens por página', value: 25 },
    { label: '50 itens por página', value: 50 },
    { label: '100 itens por página', value: 100 },
  ];

  orderPage = [
    { label: 'Funcionário (cres)', value: 'employee.name,asc' },
    { label: 'Funcionário (decr)', value: 'employee.name,desc' },
    { label: 'Cargo (crescente)', value: 'employee.position.name,asc' },
    { label: 'Cargo (decrescente)', value: 'employee.position.name,desc' },
    { label: 'Depart. (crescente)', value: 'employee.position.department.name,asc' },
    { label: 'Depart. (decrescente)', value: 'employee.position.department.name,desc' },
    { label: 'Data - crescente', value: 'date,asc' },
    { label: 'Data - decrescente', value: 'date,desc' },
  ];

  constructor(
    private employeePerformanceEvaluationsService: EmployeePerformanceEvaluationsService,
    private positionsService: PositionsService,
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private employeesService: EmployeesService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.getEmployees();
    this.getPositions();
    this.getDepartments();
    this.getTotalEmployeesPerformanceEvaluations();
    this.adicionarOpcaoPadraoDoSelectDosFiltrosParaEnums(this.labelCategoriaPadrao, this.categories);
  }

  @ViewChild('table') grid: any;

  filter: IEmployeePerformanceEvaluationFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'employee.name,asc',
    category: "",
    department: 0,
    position: 0,
    employee: 0 // Opcao Todos Funcionarios
  }

  get editing() {
    return Boolean(this.employeePerformanceEvaluation.id);
  }

  save(departmentForm: NgForm) {
    if (this.editing) {
      this.update(departmentForm)
    } else {
      this.addNew(departmentForm)
    }
  }

  addNew(employeePerformanceEvaluationForm: NgForm) {
    this.showLoading = true;
    this.employeePerformanceEvaluationsService.add(this.employeePerformanceEvaluation).subscribe(
      (employeePerformanceEvaluationAdded) => {
        this.employeePerformanceEvaluation = employeePerformanceEvaluationAdded;
        this.showLoading = false;
        this.filterEmployeePerformanceEvaluations();
        this.getTotalEmployeesPerformanceEvaluations();
        this.messageService.add({ severity: 'success', detail: 'Employee performance Evaluation added successfully' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(employeePerformanceEvaluationForm: NgForm) {
    this.showLoading = true;
    this.employeePerformanceEvaluationsService.update(this.employeePerformanceEvaluation).subscribe(
      (employeePerformanceEvaluation) => {
        this.employeePerformanceEvaluation = employeePerformanceEvaluation;
        this.filterEmployeePerformanceEvaluations();
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Employee performance Evaluation updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  filterEmployeePerformanceEvaluations(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.employeePerformanceEvaluationsService.filter(this.filter).subscribe(
      (data: IApiResponse<IEmployeePerformanceEvaluation>) => {
        this.employeePerformanceEvaluations = data.content;
        this.totalRecords = data.totalElements;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  deleteEmployeePerformanceEvaluations(employeePerformanceEvaluation: EmployeePerformanceEvaluation) {
    this.employeePerformanceEvaluationsService.delete(employeePerformanceEvaluation.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.filterEmployeePerformanceEvaluations();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Employee performance Evaluation deleted succefully!' })
        this.getTotalEmployeesPerformanceEvaluations();
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getEmployees() {
    return this.employeesService.findAll().subscribe(
      data => {
        this.employees = data.content.map(employee => {
          return {
            label: employee.person.firstName + ' ' + employee.person.lastName,
            value: employee.id
          }
        })
        this.adicionarOpcaoPadraoDoSelectDosFiltros(this.labelFuncionarioPadrao, this.employees);
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getTotalEmployeesPerformanceEvaluations() {
    this.showLoading = true;
    this.employeePerformanceEvaluationsService.getTotal().subscribe(
      (total) => {
        this.totalEmployeePerformanceEvaluations = total;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  severalDeleteConfirm(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir os items selecionados?',
      accept: () => {
        this.severalDelete();
      }
    });
  }

  severalStatusUpdateConfirm(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja atualizar os items selecionados?',
      accept: () => {
        this.severalStatusUpdate();
      }
    });
  }

  severalDelete() {
    this.employeePerformanceEvaluationsService.severalDelete(this.selectedEmployeePerformanceEvaluations).subscribe(
      () => {
        this.showLoading = true;
        if (this.grid.first === 0) {
          this.filterEmployeePerformanceEvaluations();
        } else {
          this.grid.reset();
        }
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Selected items deleted succefully!' })
        this.selectedEmployeePerformanceEvaluations = [];
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  severalStatusUpdate() {
    this.employeePerformanceEvaluationsService.severalStatusUpdate(this.selectedEmployeePerformanceEvaluations, this.selectedStatus).subscribe(
      () => {
        this.showLoading = true;
        if (this.grid.first === 0) {
          this.filterEmployeePerformanceEvaluations();
        } else {
          this.grid.reset();
        }
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Selected items updated succefully!' })
        this.selectedEmployeePerformanceEvaluations = [];
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getPositions() {
    return this.departmentService.findAll().subscribe(
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

  onFilter(): void {
    this.adicionarOpcaoPadraoDoSelectDosFiltrosParaEnums(this.labelCategoriaPadrao, this.categories);
    this.adicionarOpcaoPadraoDoSelectDosFiltrosParaEnums(this.labelFuncionarioPadrao, this.employees);
    this.displayModalFilter = true;
  }

  deletionConfirm(employeePerformanceEvaluation: IEmployeePerformanceEvaluation): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.deleteEmployeePerformanceEvaluations(employeePerformanceEvaluation);
      }
    });
  }

  onAddNewEmployeePerformanceEvaluation(): void {
    this.removerOpcaoPadraoDoSelectDosFiltros(this.labelFuncionarioPadrao);
    this.removerOpcaoPadraoDoSelectCategoriaDosFiltros(this.labelCategoriaPadrao);
    this.employeePerformanceEvaluation = new EmployeePerformanceEvaluation();
    this.displayModalSave = true;
  }

  onEditEmployeePerformanceEvaluation(editEmployeePerformanceEvaluation: EmployeePerformanceEvaluation): void {
    this.removerOpcaoPadraoDoSelectDosFiltros(this.labelFuncionarioPadrao);
    this.removerOpcaoPadraoDoSelectCategoriaDosFiltros(this.labelCategoriaPadrao);
    this.employeePerformanceEvaluation = editEmployeePerformanceEvaluation;
    this.employeePerformanceEvaluation.id = editEmployeePerformanceEvaluation.id;
    this.displayModalSave = true;
  }

  onSelectEmployeePerformanceEvaluation(selectedEmployeePerformanceEvaluation: IEmployeePerformanceEvaluation): void {
    this.selectedEmployeePerformanceEvaluationModal = selectedEmployeePerformanceEvaluation;
    this.displayModal = true;
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;
    this.filter.itemsPerPage = event!.rows!; // actualize a quantidade de itens por página de acordo com a opcao rowsPerPageOptions
    this.filterEmployeePerformanceEvaluations(page);
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
  removerOpcaoPadraoDoSelectDosFiltros(labelToRemove: string) {
    this.employees = this.employees.filter(function (opcao) {
      return opcao.label !== labelToRemove;
    });
  }

  // Função para remover uma opção no array com base no label
  removerOpcaoPadraoDoSelectCategoriaDosFiltros(labelToRemove: string) {
    this.categories = this.categories.filter(function (opcao) {
      return opcao.label !== labelToRemove;
    });
  }

  limparCampos() {
    this.filter.global = "";
    this.filter.employee = 0;
    this.filter.position = 0;
    this.filter.department = 0;
    this.filter.category = ""
    this.filter.date = undefined;
    this.filter.page = 0;
    this.filter.itemsPerPage = 10;
    this.filter.sort = "employee.name,asc"
    this.filterEmployeePerformanceEvaluations();
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
