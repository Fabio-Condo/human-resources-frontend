import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IDepartment } from '../interfaces/IDepartments';
import { IDepartmentFilter } from '../interfaces/DepartmentFilter';
import { IApiResponse } from '../interfaces/IApiResponse';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  
  departmentsUrl: string;

  constructor(private http: HttpClient) { 
    this.departmentsUrl = `${environment.apiUrl}/departments`;
  }

  getDepartments(filter: IDepartmentFilter): Observable<IApiResponse<IDepartment>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage);  

    if (filter.name) {  
      params = params.set('name', filter.name); 
    }

    console.log(params);

    return this.http.get<IApiResponse<IDepartment>>(`${this.departmentsUrl}`, { params });
  }
}
