import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';  
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';   //npm install @auth0/angular-jwt
import { User } from 'src/app/core/model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public host = environment.apiUrl;  
  private token: any;  
  private loggedInUsername: any; 
  
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
    ) {}

  public login(user: User): Observable<HttpResponse<User>> {   
    return this.http.post<User>(`${this.host}/user/login`, user, { observe: 'response' });  
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/user/register`, user);
  }

  public logOut(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');  
    localStorage.removeItem('token');  
    localStorage.removeItem('users');
  }

  public saveToken(token: any): void { 
    this.token = token;
    localStorage.setItem('token', token); 
  }

  public addUserToLocalCache(user: any): void { 
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): User {
    var retrievedObject = localStorage.getItem('user');
    if (retrievedObject) { 
        return JSON.parse(retrievedObject);
    }
    return null as any;
  }

  public loadToken(): void {  
    this.token = localStorage.getItem('token');
  }

  public getToken(): string {  
    return this.token;
  }

  public isUserLoggedIn(): any { 
    this.loadToken();
    if (this.token != null && this.token !== ''){  
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') {  
        if (!this.jwtHelper.isTokenExpired(this.token)) {  
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          console.log("Not expired")
          return true;
        }
        console.log("Expired")
      }
    } else {
      this.logOut();
      return false;
    }
  }
}
