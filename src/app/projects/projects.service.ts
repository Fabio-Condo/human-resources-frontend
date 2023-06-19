import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { IProject } from '../core/interfaces/IProject';
import { IProjectFilter } from '../core/interfaces/IProjectFilter';
import { IEmployee } from '../core/interfaces/IEmployee';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  projectsUrl: string;

  constructor(private http: HttpClient) { 
    this.projectsUrl = `${environment.apiUrl}/projects`;
  }

  filter(filter: IProjectFilter): Observable<IApiResponse<IProject>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('size', filter.itemsPerPage);  

    if (filter.sort) { 
      params = params.set('projectOrderBy', filter.sort); 
    } 

    if (filter.name) { 
     params = params.set('name', filter.name); 
    }
    if (filter.department) { 
      params = params.set('department', filter.department); 
    }
    if (filter.projectStatus) { 
      params = params.set('projectStatus', filter.projectStatus); 
    }
    console.log(params);
    return this.http.get<IApiResponse<IProject>>(`${this.projectsUrl}/filter`, { params });
  }

  getProjects(filter: IProjectFilter): Observable<IApiResponse<IProject>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage);  

    if (filter.name) {  
      params = params.set('name', filter.name); 
    }

    console.log(params);

    return this.http.get<IApiResponse<IProject>>(`${this.projectsUrl}`, { params });
  }

  findAll() : Observable<IApiResponse<IProject>> { 
    return this.http.get<IApiResponse<IProject>>(`${this.projectsUrl}`, { });
  }

  add(project: IProject): Observable<IProject> {
    return this.http.post<IProject>(this.projectsUrl, project, { });
  }

  update(project: IProject): Observable<IProject> {
    return this.http.put<IProject>(`${this.projectsUrl}/${project.id}`, project, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.projectsUrl}/${id}`, { });
  }

  addEmployeeToProject(employeeId: number, projectId: number): Observable<IProject> {
    return this.http.post<IProject>(`${this.projectsUrl}/${projectId}/employees/${employeeId}`, { });
  }

  removeEmployeeProject(employeeId: number, projectId: number): Observable<IProject> {
    return this.http.put<IProject>(`${this.projectsUrl}/${projectId}/employees/${employeeId}`, { });
  }

}
