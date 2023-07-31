import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { IEmployee } from '../core/interfaces/IEmployee';
import { IEmployeeFilter } from '../core/interfaces/IEmployeeFilter';
import { ICompanyTrainingFilter } from '../core/interfaces/ICompanyTrainingFilter';
import { ICompanyTraining } from '../core/interfaces/ICompanyTraining';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CompanyTrainingsService {

  companyTrainingsUrl: string;

  constructor(private http: HttpClient, private datePipe: DatePipe) { 
    this.companyTrainingsUrl = `${environment.apiUrl}/company-trainings`;
  }

  filter(filter: ICompanyTrainingFilter): Observable<IApiResponse<ICompanyTraining>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('trainingOrderBy', filter.sort)
      .set('size', filter.itemsPerPage); 

      if (filter.global) {
        params = params.set('global', filter.global);
      }
      if (filter.companyTrainingTypeLevel) { 
        params = params.set('companyTrainingType', filter.companyTrainingTypeLevel); 
      }
      if (filter.date) {
        params = params.set('date', this.datePipe.transform(filter.date, 'yyyy-MM-dd')!); 
      }

    console.log(params);
    return this.http.get<IApiResponse<ICompanyTraining>>(`${this.companyTrainingsUrl}/filter`, { params });
  }

  findAll() : Observable<IApiResponse<ICompanyTraining>> { 
    return this.http.get<IApiResponse<ICompanyTraining>>(`${this.companyTrainingsUrl}`, { });
  }

  add(training: ICompanyTraining): Observable<ICompanyTraining> {
    return this.http.post<ICompanyTraining>(this.companyTrainingsUrl, training, { });
  }

  update(training: ICompanyTraining): Observable<ICompanyTraining> {
    console.log(training)
    return this.http.put<ICompanyTraining>(`${this.companyTrainingsUrl}/${training.id}`, training, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.companyTrainingsUrl}/${id}`, { });
  }
  
  findById(id: number): Observable<ICompanyTraining> {
    return this.http.get<ICompanyTraining>(`${this.companyTrainingsUrl}/${id}`, { });
  }

  getTotal(): Observable<number> {
    return this.http.get<number>(`${this.companyTrainingsUrl}/total`, { });
  }
}
