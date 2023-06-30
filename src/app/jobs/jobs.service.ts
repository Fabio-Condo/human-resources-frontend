import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { DatePipe } from '@angular/common';
import { IJobFilter } from '../core/interfaces/IJobFilter';
import { IJob } from '../core/interfaces/IJob';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  jobsUrl: string;

  constructor(private http: HttpClient, private datePipe: DatePipe) { 
    this.jobsUrl = `${environment.apiUrl}/jobs`;
  }

  findAll(filter: IJobFilter) : Observable<IApiResponse<IJob>> { 
    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage); 

      console.log(params);

    return this.http.get<IApiResponse<IJob>>(`${this.jobsUrl}`, { params });
  }

  findAllForView(filter: IJobFilter) : Observable<IApiResponse<IJob>> { 
    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage); 

    if (filter.name) { 
      params = params.set('name', filter.name); 
    }

    console.log(params);

    return this.http.get<IApiResponse<IJob>>(`${this.jobsUrl}/view`, { params });
  }

  filter(filter: IJobFilter) : Observable<IApiResponse<IJob>> { 
    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('jobOrderBy', filter.sort)
      .set('size', filter.itemsPerPage); 

    if (filter.positionName) { 
      params = params.set('positionName', filter.positionName); 
    }
    if (filter.workplace) { 
      params = params.set('workplace', filter.workplace); 
    }
    if (filter.publicationDate) {
      params = params.set('publicationDate', this.datePipe.transform(filter.publicationDate, 'yyyy-MM-dd')!); 
    }

    console.log(params);

    return this.http.get<IApiResponse<IJob>>(`${this.jobsUrl}/filter`, { params });
  }

  add(job: IJob): Observable<IJob> {
    return this.http.post<IJob>(this.jobsUrl, job, { });
  }

  update(job: IJob): Observable<IJob> {
    console.log(job)
    return this.http.put<IJob>(`${this.jobsUrl}/${job.id}`, job, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.jobsUrl}/${id}`, { });
  }

  findById(id: number): Observable<IJob>{
    return this.http.get<IJob>(`${this.jobsUrl}/${id}`, { });
  }

  findByIdForView(id: number): Observable<IJob>{
    return this.http.get<IJob>(`${this.jobsUrl}/view/${id}`, { });
  }

  addCandidateToJob(candidateId: number, jobId: number): Observable<IJob> {
    return this.http.post<IJob>(`${this.jobsUrl}/${jobId}/candidates/${candidateId}`, { });
  }

  removeCandidateFromJob(candidateId: number, jobId: number): Observable<IJob> {
    return this.http.put<IJob>(`${this.jobsUrl}/${jobId}/candidates/${candidateId}`, { });
  }

  selectCandidateCandidateToJob(candidateId: number, jobId: number): Observable<IJob> {
    return this.http.post<IJob>(`${this.jobsUrl}/${jobId}/selected-candidates/${candidateId}`, { });
  }

  removeSelectedCandidateFromJob(candidateId: number, jobId: number): Observable<IJob> {
    return this.http.put<IJob>(`${this.jobsUrl}/${jobId}/selected-candidates/${candidateId}`, { });
  }

  buscarTotal(): Observable<number> {
    return this.http.get<number>(`${this.jobsUrl}/total`, { });
  }

}
