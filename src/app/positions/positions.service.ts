import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../interfaces/IApiResponse';
import { IPosition } from '../interfaces/IPosition';
import { IPositionFilter } from '../interfaces/IPositionFilter';

@Injectable({
  providedIn: 'root'
})
export class PositionsService {

  positionsUrl: string;

  constructor(private http: HttpClient) { 
    this.positionsUrl = `${environment.apiUrl}/positions`;
  }

  getPositions(filter: IPositionFilter): Observable<IApiResponse<IPosition>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage);  

    if (filter.name) {  
      params = params.set('name', filter.name); 
    }

    console.log(params);

    return this.http.get<IApiResponse<IPosition>>(`${this.positionsUrl}`, { params });
  }
}
