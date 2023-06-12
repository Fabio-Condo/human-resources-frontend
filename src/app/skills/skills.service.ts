import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { ISkill } from '../core/interfaces/ISkill';
import { ISkillsFilter } from '../core/interfaces/ISkillsFilter';
import { Skill } from '../core/model/Skill';

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
 
  findAll() : Observable<IApiResponse<ISkill>> { 
    return this.http.get<IApiResponse<ISkill>>(`${this.skillsUrl}`, { });
  }

  add(skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(this.skillsUrl, skill, { });
  }

  update(skill: Skill): Observable<Skill> {
    return this.http.put<Skill>(`${this.skillsUrl}/${skill.id}`, skill, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.skillsUrl}/${id}`, { });
  }
}
