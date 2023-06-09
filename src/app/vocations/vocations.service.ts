import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { IVocation } from '../core/interfaces/IVocation';
import { IVocationFilter } from '../core/interfaces/IVocationFilter';

@Injectable({
  providedIn: 'root'
})
export class VocationsService {

  vocationsUrl: string;

  constructor(private http: HttpClient) { 
    this.vocationsUrl = `${environment.apiUrl}/vocations`;
  }

  findAll(filter: IVocationFilter) : Observable<IApiResponse<IVocation>> { 
    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage); 

      console.log(params);

    return this.http.get<IApiResponse<IVocation>>(`${this.vocationsUrl}`, { params });
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
}
