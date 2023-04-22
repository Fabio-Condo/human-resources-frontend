import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { IAdministrativeCluster } from 'src/app/interfaces/IAdministrativeCluster';
import { IAdministrativeClusterFilter } from 'src/app/interfaces/IAdministrativeClusterFilter';
import { IApiResponse } from 'src/app/interfaces/IApiResponse';
import { AdministrativeCluster } from 'src/app/model/AdministrativeCluster';
import { AdministrativeClustersService } from '../administrative-clusters.service';

@Component({
  selector: 'app-administrative-clusters',
  templateUrl: './administrative-clusters.component.html',
  styleUrls: ['./administrative-clusters.component.css']
})
export class AdministrativeClustersComponent implements OnInit {


  showLoading: boolean = false;

  totalRecords: number = 0
  administrativeClusters: IAdministrativeCluster[] = [];

  administrativeCluster: IAdministrativeCluster = new AdministrativeCluster;
  displayModalSave: boolean = false;

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
    private administrativeClustersService: AdministrativeClustersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Administrative Clusters page');
  }

  filter: IAdministrativeClusterFilter = {
    page: 0,
    itemsPerPage: 5,
    sort: 'name,asc'
  }

  @ViewChild('table') grid: any;

  get editing() {
    return Boolean(this.administrativeCluster.id);
  }

  save(administrativeClusterForm: NgForm) {
    if (this.editing) {
      this.update(administrativeClusterForm)
    } else {
      this.addNew(administrativeClusterForm)
    }
  }

  addNew(administrativeClusterForm: NgForm) {
    this.showLoading = true;
    this.administrativeClustersService.add(this.administrativeCluster).subscribe(
      (administrativeClusterAdded) => {
        this.administrativeCluster = administrativeClusterAdded;
        this.showLoading = false;
        this.getAdministrativeClusters();
        this.messageService.add({ severity: 'success', detail: 'Administrative Cluster added successfully' });      
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(administrativeClusterForm: NgForm) {
    this.showLoading = true;
    this.administrativeClustersService.update(this.administrativeCluster).subscribe(
      (administrativeCluster) => {
        this.administrativeCluster = administrativeCluster;
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Administrative Cluster updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getAdministrativeClusters(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.showLoading = true;
    this.administrativeClustersService.getAdministrativeClusters(this.filter).subscribe(
      (data: IApiResponse<IAdministrativeCluster>) => {
        this.administrativeClusters = data.content;
        this.totalRecords = data.totalElements;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );   
  }

  deleteDepartment(editAdministrativeCluster: IAdministrativeCluster) {
    this.administrativeClustersService.delete(editAdministrativeCluster.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.getAdministrativeClusters();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Administrative Cluster deleted succefully!' })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  deletionConfirm(editAdministrativeCluster: IAdministrativeCluster): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
          this.deleteDepartment(editAdministrativeCluster);
      }
    });
  }

  onAddNewadministrativeCluster(): void {
    this.administrativeCluster = new AdministrativeCluster();
    this.displayModalSave = true;
  }

  onEditDepartment(editAdministrativeCluster: AdministrativeCluster): void {
    this.administrativeCluster = editAdministrativeCluster;
    this.administrativeCluster.id = editAdministrativeCluster.id // Not necessary
    this.displayModalSave = true;
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.getAdministrativeClusters(page);
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
