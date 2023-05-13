import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { IPerformanceEvaluation } from '../core/interfaces/IPerformanceEvaluation';
import { IPerformanceEvaluationFilter } from '../core/interfaces/IPerformanceEvaluationFilter';

@Injectable({
  providedIn: 'root'
})
export class PerformanceEvaluationsService {

  performanceEvaluationsUrl: string;

  constructor(private http: HttpClient) { 
    this.performanceEvaluationsUrl = `${environment.apiUrl}/performance-evaluations`;
  }

  getPerformanceEvaluations(filter: IPerformanceEvaluationFilter): Observable<IApiResponse<IPerformanceEvaluation>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage);  

    if (filter.property) {  
      params = params.set('property', filter.property); 
    }

    console.log(params);

    return this.http.get<IApiResponse<IPerformanceEvaluation>>(`${this.performanceEvaluationsUrl}`, { params });
  }

  add(performanceEvaluation: IPerformanceEvaluation): Observable<IPerformanceEvaluation> {
    return this.http.post<IPerformanceEvaluation>(this.performanceEvaluationsUrl, performanceEvaluation, { });
  }

  update(performanceEvaluation: IPerformanceEvaluation): Observable<IPerformanceEvaluation> {
    return this.http.put<IPerformanceEvaluation>(`${this.performanceEvaluationsUrl}/${performanceEvaluation.id}`, performanceEvaluation, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.performanceEvaluationsUrl}/${id}`, { });
  }
}
