import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { ILocation } from '../core/interfaces/ILocation';
import { ILocationFilter } from '../core/interfaces/ILocationFilter';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  locationsUrl: string;

  constructor(private http: HttpClient) { 
    this.locationsUrl = `${environment.apiUrl}/locations`;
  }

  getLocations(filter: ILocationFilter): Observable<IApiResponse<ILocation>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage);  

    if (filter.name) {  
      params = params.set('name', filter.name); 
    }

    console.log(params);

    return this.http.get<IApiResponse<ILocation>>(`${this.locationsUrl}`, { params });
  }

  findAll() : Observable<IApiResponse<ILocation>> { 
    return this.http.get<IApiResponse<ILocation>>(`${this.locationsUrl}`, { });
  }

  add(location: ILocation): Observable<ILocation> {
    return this.http.post<ILocation>(this.locationsUrl, location, { });
  }

  update(location: ILocation): Observable<ILocation> {
    return this.http.put<ILocation>(`${this.locationsUrl}/${location.id}`, location, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.locationsUrl}/${id}`, { });
  }

  getTotal(): Observable<number> {
    return this.http.get<number>(`${this.locationsUrl}/total`, { });
  }
}
