import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IDepartment } from '../core/interfaces/IDepartments';
import { IDepartmentFilter } from '../core/interfaces/IDepartmentFilter';
import { IApiResponse } from '../core/interfaces/IApiResponse';

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

  findAll() : Observable<IApiResponse<IDepartment>> { 
    return this.http.get<IApiResponse<IDepartment>>(`${this.departmentsUrl}`, { });
  }

  add(department: IDepartment): Observable<IDepartment> {
    return this.http.post<IDepartment>(this.departmentsUrl, department, { });
  }

  update(department: IDepartment): Observable<IDepartment> {
    return this.http.put<IDepartment>(`${this.departmentsUrl}/${department.id}`, department, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.departmentsUrl}/${id}`, { });
  }

  getTotal(): Observable<number> {
    return this.http.get<number>(`${this.departmentsUrl}/total`, { });
  }
}
