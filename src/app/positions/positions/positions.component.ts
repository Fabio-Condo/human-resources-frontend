import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IApiResponse } from 'src/app/interfaces/IApiResponse';
import { IPosition } from 'src/app/interfaces/IPosition';
import { IPositionFilter } from 'src/app/interfaces/IPositionFilter';
import { PositionsService } from '../positions.service';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css']
})
export class PositionsComponent implements OnInit {

  totalRecords: number = 0
  positions: IPosition[] = [];

  showLoading: boolean = false;

  constructor(
    private positionsService: PositionsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getPositions();
  }

  filter: IPositionFilter = {
    page: 0,
    itemsPerPage: 5,
    sort: ''
  }

  getPositions(): void {
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

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }
}
