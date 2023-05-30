import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { IEmployee } from '../core/interfaces/IEmployee';
import { IEmployeeFilter } from '../core/interfaces/IEmployeeFilter';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  employeesUrl: string;

  constructor(private http: HttpClient) { 
    this.employeesUrl = `${environment.apiUrl}/employees`;
  }

  getEmployees(filter: IEmployeeFilter): Observable<IApiResponse<IEmployee>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage);  

    if (filter.name) {  
      params = params.set('name', filter.name); 
    }

    console.log(params);

    return this.http.get<IApiResponse<IEmployee>>(`${this.employeesUrl}`, { params });
  }

  findAll() : Observable<IApiResponse<IEmployee>> { 
    return this.http.get<IApiResponse<IEmployee>>(`${this.employeesUrl}`, { });
  }

  add(employe: IEmployee): Observable<IEmployee> {
    return this.http.post<IEmployee>(this.employeesUrl, employe, { });
  }

  update(employe: IEmployee): Observable<IEmployee> {
    console.log(employe)
    return this.http.put<IEmployee>(`${this.employeesUrl}/${employe.id}`, employe, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.employeesUrl}/${id}`, { });
  }
}
