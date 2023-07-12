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

  filter(filter: IEmployeeFilter): Observable<IApiResponse<IEmployee>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('size', filter.itemsPerPage);  

    if (filter.sort) { 
      params = params.set('employeeOrderBy', filter.sort); 
    } 

    if (filter.name) { 
     params = params.set('name', filter.name); 
    }
    if (filter.birthplace) { 
      params = params.set('birthplace', filter.birthplace); 
    }
    if (filter.gender) { 
      params = params.set('gender', filter.gender); 
    }
    if (filter.department) { 
      params = params.set('department', filter.department); 
    }
    if (filter.position) { 
      params = params.set('position', filter.position); 
    }
    if (filter.contractType) { 
      params = params.set('contractType', filter.contractType); 
    }
    if (filter.maritalStatus) { 
      params = params.set('maritalStatus', filter.maritalStatus); 
    }

    console.log(params);
    return this.http.get<IApiResponse<IEmployee>>(`${this.employeesUrl}/filter`, { params });
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

  changeStatus(id: number, active: boolean): Observable<void> {
    return this.http.put<void>(`${this.employeesUrl}/${id}/active`, active, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.employeesUrl}/${id}`, { });
  }
  
  findById(id: number): Observable<IEmployee> {
    return this.http.get<IEmployee>(`${this.employeesUrl}/${id}`, { });
  }
}
