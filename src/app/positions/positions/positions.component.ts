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
import { Position } from 'src/app/model/Position';
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
    this.showLoading = true;
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
        this.departments = data.content.map(data2 => {
          return  {
            label: data2.name,
            value: data2.id
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
        this.administrativeClusters = data.content.map(data2 => {
          return  {
            label: data2.name,
            value: data2.id
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
        this.workplaces = data.content.map(data2 => {
          return  {
            label: data2.name,
            value: data2.id
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
