
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  countriesUrl: string;

  constructor(private http: HttpClient) {
    this.countriesUrl = `${environment.apiUrl}/countries`;
  }

  findAll() : Promise<any> {
    return firstValueFrom(this.http.get(this.countriesUrl, { }));
  }

}
