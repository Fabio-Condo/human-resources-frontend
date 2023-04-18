import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IAdministrativeCluster } from 'src/app/interfaces/IAdministrativeCluster';
import { IAdministrativeClusterFilter } from 'src/app/interfaces/IAdministrativeClusterFilter';
import { IApiResponse } from 'src/app/interfaces/IApiResponse';
import { AdministrativeClustersService } from '../administrative-clusters.service';

@Component({
  selector: 'app-administrative-clusters',
  templateUrl: './administrative-clusters.component.html',
  styleUrls: ['./administrative-clusters.component.css']
})
export class AdministrativeClustersComponent implements OnInit {

  totalRecords: number = 0
  administrativeClusters: IAdministrativeCluster[] = [];

  showLoading: boolean = false;

  constructor(
    private administrativeClustersService: AdministrativeClustersService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getAdministrativeClusters();
  }

  filter: IAdministrativeClusterFilter = {
    page: 0,
    itemsPerPage: 5,
    sort: ''
  }

  getAdministrativeClusters(): void {
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

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
