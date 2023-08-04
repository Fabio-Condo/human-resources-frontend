import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/model/User';
import { CustomHttpRespone } from '../core/interfaces/CustomHttpRespone';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { IUserFilter } from '../core/interfaces/IUserFilter';

@Injectable({ providedIn: 'root' })
export class UserService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  search(filter: IUserFilter): Observable<IApiResponse<User>> {

    let params = new HttpParams()
      .set('page', filter.page)
      .set('size', filter.itemsPerPage)
      .set('sort', filter.sort);

    if (filter.name) {
      params = params.set('name', filter.name);
    }

    console.log(params);
    console.log("Getting list");

    return this.http.get<IApiResponse<User>>(`${this.host}/user/list/pageable`, { params });
  }

  filter(filter: IUserFilter): Observable<IApiResponse<User>> {

    let params = new HttpParams()
      .set('page', filter.page)
      .set('size', filter.itemsPerPage);

    if (filter.global) {
      params = params.set('global', filter.global);
    }
    if (filter.sort) {
      params = params.set('userOrderBy', filter.sort);
    }
    /*if (filter.firstName) {
      params = params.set('firstName', filter.firstName);
    }
    if (filter.lastName) {
      params = params.set('lastName', filter.lastName);
    }*/
    if (filter.username) {
      params = params.set('username', filter.username);
    }
    if (filter.email) {
      params = params.set('email', filter.email);
    }
    if (filter.role) {
      params = params.set('role', filter.role);
    }
    if (filter.isActive) {
      params = params.set('isActiveStr', filter.isActive);
    }
    if (filter.isNotLocked) {
      params = params.set('isNotLockedStr', filter.isNotLocked);
    }

    console.log(params);
    console.log("Getting list");

    return this.http.get<IApiResponse<User>>(`${this.host}/user/filter`, { params });
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/user/list`);
  }

  public addUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/update`, formData);
  }

  public updateCurentUserProfile(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/update/profile`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpRespone> {
    return this.http.get<CustomHttpRespone>(`${this.host}/user/resetpassword/${email}`);
  }

  public deleteUser(username: string): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/user/delete/${username}`);
  }

  public createUserFormDate(loggedInUsername: any, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.person.firstName);
    formData.append('lastName', user.person.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.notLocked));
    formData.append('gender', user.person.gender);
    return formData;
  }

  changeStatusActive(username: string, active: boolean): Observable<void> {
    return this.http.put<void>(`${this.host}/${username}/active-user`, active, {});
  }

  changeStatusNotLocked(username: string, notLocked: boolean): Observable<void> {
    return this.http.put<void>(`${this.host}/${username}/notLocked-user`, notLocked, {});
  }

  changeStatusIsFirstLogin(username: string): Observable<void> {
    return this.http.put<void>(`${this.host}/${username}/first-login-user`, {});
  }

  getUserById(username: string): Observable<User> {
    return this.http.get<User>(`${this.host}/user/find/${username}`, {});
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.host}/update/${user.id}`, user, {});
  }

}
