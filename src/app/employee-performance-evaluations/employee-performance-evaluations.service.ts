import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../interfaces/IApiResponse';
import { IEmployeePerformanceEvaluation } from '../interfaces/IEmployeePerformanceEvaluation';
import { IEmployeePerformanceEvaluationFilter } from '../interfaces/IEmployeePerformanceEvaluationFilter';

@Injectable({
  providedIn: 'root'
})
export class EmployeePerformanceEvaluationsService {

  employeePerformanceEvaluation: string;

  constructor(private http: HttpClient) { 
    this.employeePerformanceEvaluation = `${environment.apiUrl}/employees-performance-evaluations`;
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
