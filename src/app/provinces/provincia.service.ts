
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  provincesUrl: string;

  constructor(private http: HttpClient) {
    this.provincesUrl = `${environment.apiUrl}/provinces`;
  }

  findAll() : Promise<any> {
    return firstValueFrom(this.http.get(this.provincesUrl, { }));
  }

}
