import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../interfaces/IApiResponse';
import { IPerformanceEvaluation } from '../interfaces/IPerformanceEvaluation';
import { IPerformanceEvaluationFilter } from '../interfaces/IPerformanceEvaluationFilter';

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

    if (filter.proficiencyLevel) {  
      params = params.set('proficiencyLevel', filter.proficiencyLevel); 
    }

    console.log(params);

    return this.http.get<IApiResponse<IPerformanceEvaluation>>(`${this.performanceEvaluationsUrl}`, { params });
  }
}
