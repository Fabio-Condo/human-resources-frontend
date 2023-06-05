import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { IEmployeePerformanceEvaluation } from '../core/interfaces/IEmployeePerformanceEvaluation';
import { IEmployeePerformanceEvaluationFilter } from '../core/interfaces/IEmployeePerformanceEvaluationFilter';

@Injectable({
  providedIn: 'root'
})
export class EmployeePerformanceEvaluationsService {

  employeePerformanceEvaluation: string;

  constructor(private http: HttpClient) { 
    this.employeePerformanceEvaluation = `${environment.apiUrl}/employees-performance-evaluations`;
  }

  filter(filter: IEmployeePerformanceEvaluationFilter): Observable<IApiResponse<IEmployeePerformanceEvaluation>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('size', filter.itemsPerPage);  

    if (filter.sort) { 
      params = params.set('employeePerformanceEvaluationOrderBy', filter.sort); 
    } 

    if (filter.name) { 
     params = params.set('name', filter.name); 
    }
    if (filter.category) { 
      params = params.set('category', filter.category); 
    }
    if (filter.employee) { 
      params = params.set('employee', filter.employee); 
    }

    console.log(params);
    return this.http.get<IApiResponse<IEmployeePerformanceEvaluation>>(`${this.employeePerformanceEvaluation}/filter`, { params });
  }

  getEmployeePerformanceEvaluations(filter: IEmployeePerformanceEvaluationFilter): Observable<IApiResponse<IEmployeePerformanceEvaluation>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage);  

    if (filter.name) {  
      params = params.set('name', filter.name); 
    }

    console.log(params);

    return this.http.get<IApiResponse<IEmployeePerformanceEvaluation>>(`${this.employeePerformanceEvaluation}`, { params });
  }

  add(employeePerformanceEvaluation: IEmployeePerformanceEvaluation): Observable<IEmployeePerformanceEvaluation> {
    return this.http.post<IEmployeePerformanceEvaluation>(this.employeePerformanceEvaluation, employeePerformanceEvaluation, { });
  }

  update(employeePerformanceEvaluation: IEmployeePerformanceEvaluation): Observable<IEmployeePerformanceEvaluation> {
    return this.http.put<IEmployeePerformanceEvaluation>(`${this.employeePerformanceEvaluation}/${employeePerformanceEvaluation.id}`, employeePerformanceEvaluation, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.employeePerformanceEvaluation}/${id}`, { });
  }
}
