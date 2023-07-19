import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { IPosition } from '../core/interfaces/IPosition';
import { IPositionFilter } from '../core/interfaces/IPositionFilter';
import { Position } from '../core/model/Position';

@Injectable({
  providedIn: 'root'
})
export class PositionsService {

  positionsUrl: string;

  constructor(private http: HttpClient) { 
    this.positionsUrl = `${environment.apiUrl}/positions`;
  }

  filter(filter: IPositionFilter): Observable<IApiResponse<IPosition>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('size', filter.itemsPerPage);  

    if (filter.sort) { 
      params = params.set('positionOrderBy', filter.sort); 
    } 
    
    if (filter.global) { 
      params = params.set('global', filter.global); 
    }
    if (filter.name) { 
     params = params.set('name', filter.name); 
    }
    if (filter.department) { 
      params = params.set('department', filter.department); 
    }
    if (filter.location) { 
      params = params.set('location', filter.location); 
    }
    if (filter.functionalGroup) { 
      params = params.set('functionalGroup', filter.functionalGroup); 
    }
    if (filter.positionType) { 
      params = params.set('positionType', filter.positionType); 
    }

    console.log(params);
    return this.http.get<IApiResponse<IPosition>>(`${this.positionsUrl}/filter`, { params });
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

  findAll() : Observable<IApiResponse<IPosition>> { 
    return this.http.get<IApiResponse<IPosition>>(`${this.positionsUrl}`, { });
  }

  getPositionsByDepartmentId(departmentId: number): Promise<Position[]> {
    const params = new HttpParams()
      .set('departmentId', departmentId); 
    return firstValueFrom(this.http.get<Position[]>(this.positionsUrl+'/byDepartmentId', { params }));
  }

  add(position: IPosition): Observable<IPosition> {
    return this.http.post<IPosition>(this.positionsUrl, position, { });
  }

  update(position: IPosition): Observable<IPosition> {
    return this.http.put<IPosition>(`${this.positionsUrl}/${position.id}`, position, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.positionsUrl}/${id}`, { });
  }

  getById(id: number): Observable<IPosition> {
    return this.http.get<IPosition>(`${this.positionsUrl}/${id}`, { });
  }
}
