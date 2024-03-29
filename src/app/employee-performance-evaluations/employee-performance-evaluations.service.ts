import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { IEmployeePerformanceEvaluation } from '../core/interfaces/IEmployeePerformanceEvaluation';
import { IEmployeePerformanceEvaluationFilter } from '../core/interfaces/IEmployeePerformanceEvaluationFilter';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EmployeePerformanceEvaluationsService {

  employeePerformanceEvaluation: string;

  constructor(private http: HttpClient, private datePipe: DatePipe) { 
    this.employeePerformanceEvaluation = `${environment.apiUrl}/employees-performance-evaluations`;
  }

  filter(filter: IEmployeePerformanceEvaluationFilter): Observable<IApiResponse<IEmployeePerformanceEvaluation>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('size', filter.itemsPerPage);  

    if (filter.sort) { 
      params = params.set('employeePerformanceEvaluationOrderBy', filter.sort); 
    } 

    if (filter.global) { 
      params = params.set('global', filter.global); 
    }
    if (filter.category) { 
      params = params.set('category', filter.category); 
    }
    if (filter.employee) { 
      params = params.set('employee', filter.employee); 
    }
    if (filter.position) { 
      params = params.set('position', filter.position); 
    }
    if (filter.department) { 
      params = params.set('department', filter.department); 
    }
    if (filter.date) {
      params = params.set('date', this.datePipe.transform(filter.date, 'yyyy-MM-dd')!); 
    }

    console.log(params);
    return this.http.get<IApiResponse<IEmployeePerformanceEvaluation>>(`${this.employeePerformanceEvaluation}/filter`, { params });
  }

  getEmployeePerformanceEvaluations(filter: IEmployeePerformanceEvaluationFilter): Observable<IApiResponse<IEmployeePerformanceEvaluation>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage);  

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

  severalDelete(employeePerformanceEvaluationList: IEmployeePerformanceEvaluation[]): Observable<IEmployeePerformanceEvaluation[]> {
    return this.http.post<IEmployeePerformanceEvaluation[]>(`${this.employeePerformanceEvaluation}/deleteAll`, employeePerformanceEvaluationList, { });
  }

  severalStatusUpdate(employeePerformanceEvaluationList: IEmployeePerformanceEvaluation[], status: string): Observable<IEmployeePerformanceEvaluation[]> {
    return this.http.put<IEmployeePerformanceEvaluation[]>(`${this.employeePerformanceEvaluation}/updateStatusAll/${status}`, employeePerformanceEvaluationList, { });
  }

  getTotal(): Observable<number> {
    return this.http.get<number>(`${this.employeePerformanceEvaluation}/total`, { });
  }
}
