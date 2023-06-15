import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { IPayRoll } from '../core/interfaces/IPayRoll';
import { IPayrollFilter } from '../core/interfaces/IPayrollFilter';

@Injectable({
  providedIn: 'root'
})
export class PayRollService {

  
  payrollssUrl: string;

  constructor(private http: HttpClient) { 
    this.payrollssUrl = `${environment.apiUrl}/payrolls`;
  }

  filter(filter: IPayrollFilter): Observable<IApiResponse<IPayRoll>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage);  

    console.log(params);

    return this.http.get<IApiResponse<IPayRoll>>(`${this.payrollssUrl}`, { params });
  }

  findAll() : Observable<IApiResponse<IPayRoll>> { 
    return this.http.get<IApiResponse<IPayRoll>>(`${this.payrollssUrl}`, { });
  }

  add(payroll: IPayRoll): Observable<IPayRoll> {
    return this.http.post<IPayRoll>(this.payrollssUrl, payroll, { });
  }

  update(payroll: IPayRoll): Observable<IPayRoll> {
    return this.http.put<IPayRoll>(`${this.payrollssUrl}/${payroll.id}`, payroll, { });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.payrollssUrl}/${id}`, { });
  }
}
