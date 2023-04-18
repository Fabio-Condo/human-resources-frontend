import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../interfaces/IApiResponse';
import { IWorkplace } from '../interfaces/IWorkplace';
import { IWorkplaceFilter } from '../interfaces/WorkplaceFilter';

@Injectable({
  providedIn: 'root'
})
export class WorkplacesService {

  workplacesUrl: string;

  constructor(private http: HttpClient) { 
    this.workplacesUrl = `${environment.apiUrl}/workplaces`;
  }

  getWorkplaces(filter: IWorkplaceFilter): Observable<IApiResponse<IWorkplace>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage);  

    if (filter.name) {  
      params = params.set('name', filter.name); 
    }

    console.log(params);

    return this.http.get<IApiResponse<IWorkplace>>(`${this.workplacesUrl}`, { params });
  }
}
