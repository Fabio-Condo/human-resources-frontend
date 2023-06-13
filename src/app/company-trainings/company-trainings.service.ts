import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { IEmployee } from '../core/interfaces/IEmployee';
import { IEmployeeFilter } from '../core/interfaces/IEmployeeFilter';
import { ICompanyTrainingFilter } from '../core/interfaces/ICompanyTrainingFilter';
import { ICompanyTraining } from '../core/interfaces/ICompanyTraining';

@Injectable({
  providedIn: 'root'
})
export class CompanyTrainingsService {

  companyTrainingsUrl: string;

  constructor(private http: HttpClient) { 
    this.companyTrainingsUrl = `${environment.apiUrl}/company-trainings`;
  }

  filter(filter: ICompanyTrainingFilter): Observable<IApiResponse<ICompanyTraining>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('size', filter.itemsPerPage); 

    console.log(params);
    return this.http.get<IApiResponse<ICompanyTraining>>(`${this.companyTrainingsUrl}`, { params });
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

  addEmployeeToTraining(employeeId: number, traningId: number): Observable<ICompanyTraining> {
    return this.http.post<ICompanyTraining>(`${this.companyTrainingsUrl}/${traningId}/employees/${employeeId}`, { });
  }

  removeEmployeeFromTraining(employeeId: number, traningId: number): Observable<ICompanyTraining> {
    return this.http.put<ICompanyTraining>(`${this.companyTrainingsUrl}/${traningId}/employees/${employeeId}`, { });
  }
}
