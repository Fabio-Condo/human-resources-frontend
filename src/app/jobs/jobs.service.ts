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

}
