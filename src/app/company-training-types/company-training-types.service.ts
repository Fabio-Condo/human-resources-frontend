import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { ICompanyTraining } from '../core/interfaces/ICompanyTraining';
import { ICompanyTrainingType } from '../core/interfaces/ICompanyTrainingType';

@Injectable({
  providedIn: 'root'
})
export class CompanyTrainingTypesService {

  companyTrainingsUrl: string;

  constructor(private http: HttpClient) { 
    this.companyTrainingsUrl = `${environment.apiUrl}/company-training-types`;
  }

  findAll() : Observable<IApiResponse<ICompanyTrainingType>> { 
    return this.http.get<IApiResponse<ICompanyTrainingType>>(`${this.companyTrainingsUrl}`, { });
  }

  add(trainingType: ICompanyTrainingType): Observable<ICompanyTrainingType> {
    return this.http.post<ICompanyTrainingType>(this.companyTrainingsUrl, trainingType, { });
  }

  update(trainingType: ICompanyTrainingType): Observable<ICompanyTrainingType> {
    console.log(trainingType)
    return this.http.put<ICompanyTrainingType>(`${this.companyTrainingsUrl}/${trainingType.id}`, trainingType, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.companyTrainingsUrl}/${id}`, { });
  }
  
  findById(id: number): Observable<ICompanyTrainingType> {
    return this.http.get<ICompanyTrainingType>(`${this.companyTrainingsUrl}/${id}`, { });
  }

}
