import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../interfaces/IApiResponse';
import { ISkill } from '../interfaces/ISkill';
import { ISkillsFilter } from '../interfaces/ISkillsFilter';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  skillsUrl: string;

  constructor(private http: HttpClient) { 
    this.skillsUrl = `${environment.apiUrl}/skills`;
  }

  getSkills(filter: ISkillsFilter): Observable<IApiResponse<ISkill>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage);  

    if (filter.name) {  
      params = params.set('name', filter.name); 
    }

    console.log(params);

    return this.http.get<IApiResponse<ISkill>>(`${this.skillsUrl}`, { params });
  }
}
