import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { IVocation } from '../core/interfaces/IVocation';
import { IVocationFilter } from '../core/interfaces/IVocationFilter';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VocationsService {

  vocationsUrl: string;

  constructor(private http: HttpClient, private datePipe: DatePipe) { 
    this.vocationsUrl = `${environment.apiUrl}/vocations`;
  }

  findAll(filter: IVocationFilter) : Observable<IApiResponse<IVocation>> { 
    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('vocationOrderBy', filter.sort)
      .set('size', filter.itemsPerPage); 

      if (filter.global) { 
        params = params.set('global', filter.global); 
      }
      if (filter.vocationStatus) { 
        params = params.set('vocationStatus', filter.vocationStatus); 
      }
      if (filter.vocationType) { 
        params = params.set('vocationType', filter.vocationType); 
      }
      if (filter.employee) { 
        params = params.set('employee', filter.employee); 
      }
      if (filter.beginDate) {
        params = params.set('beginDate', this.datePipe.transform(filter.beginDate, 'yyyy-MM-dd')!); 
      }
      if (filter.endDate) {
        params = params.set('endDate', this.datePipe.transform(filter.endDate, 'yyyy-MM-dd')!); 
      }
      console.log(params);

    return this.http.get<IApiResponse<IVocation>>(`${this.vocationsUrl}/filter`, { params });
  }

  add(vocation: IVocation): Observable<IVocation> {
    return this.http.post<IVocation>(this.vocationsUrl, vocation, { });
  }

  update(vocation: IVocation): Observable<IVocation> {
    console.log(vocation)
    return this.http.put<IVocation>(`${this.vocationsUrl}/${vocation.id}`, vocation, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.vocationsUrl}/${id}`, { });
  }

  severalDelete(vocationList: IVocation[]): Observable<IVocation[]> {
    return this.http.post<IVocation[]>(`${this.vocationsUrl}/deleteAll`, vocationList, { });
  }

  severalStatusUpdate(vocationList: IVocation[], status: string): Observable<IVocation[]> {
    return this.http.put<IVocation[]>(`${this.vocationsUrl}/updateStatusAll/${status}`, vocationList, { });
  }
}
