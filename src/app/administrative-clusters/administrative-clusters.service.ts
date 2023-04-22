import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAdministrativeCluster } from '../interfaces/IAdministrativeCluster';
import { IAdministrativeClusterFilter } from '../interfaces/IAdministrativeClusterFilter';
import { IApiResponse } from '../interfaces/IApiResponse';

@Injectable({
  providedIn: 'root'
})
export class AdministrativeClustersService {

administrativeClusterUrl: string;

  constructor(private http: HttpClient) { 
    this.administrativeClusterUrl = `${environment.apiUrl}/administrative-clusters`;
  }

  getAdministrativeClusters(filter: IAdministrativeClusterFilter): Observable<IApiResponse<IAdministrativeCluster>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage);  

    if (filter.name) {  
      params = params.set('name', filter.name); 
    }

    console.log(params);

    return this.http.get<IApiResponse<IAdministrativeCluster>>(`${this.administrativeClusterUrl}`, { params });
  }

  findAll() : Observable<IApiResponse<IAdministrativeCluster>> { 
    return this.http.get<IApiResponse<IAdministrativeCluster>>(`${this.administrativeClusterUrl}`, { });
  }

  add(administrativeCluster: IAdministrativeCluster): Observable<IAdministrativeCluster> {
    return this.http.post<IAdministrativeCluster>(this.administrativeClusterUrl, administrativeCluster, { });
  }

  update(administrativeCluster: IAdministrativeCluster): Observable<IAdministrativeCluster> {
    return this.http.put<IAdministrativeCluster>(`${this.administrativeClusterUrl}/${administrativeCluster.id}`, administrativeCluster, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.administrativeClusterUrl}/${id}`, { });
  }
}
