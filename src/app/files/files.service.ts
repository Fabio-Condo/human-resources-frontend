import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Arquivo } from '../core/model/Arquivo';
import { IArquivosFilter } from '../core/interfaces/IArquivosFilter';
import { IApiResponse } from '../core/interfaces/IApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class FilesService {

  arquivosUrl: string;

  constructor(private http: HttpClient) { 
    this.arquivosUrl = `${environment.apiUrl}/file`;
  }

  // define function to upload files
  upload(formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(`${this.arquivosUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  // define function to download files
  download(filename: string): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.arquivosUrl}/download/${filename}/`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    });
  }

  downloadFile(filename: string): Observable<Blob> {
    return this.http.get(`${this.arquivosUrl}/download/${filename}/`, { responseType: 'blob' });
  }

  //list(): Observable<Arquivo[]> {
  //  return this.http.get<Arquivo[]>(`${this.arquivosUrl}/list`);
  //}

  getFiles(filter: IArquivosFilter): Observable<IApiResponse<Arquivo>> {  

    let params = new HttpParams()  
      .set('page', filter.page)  
      .set('sort', filter.sort)
      .set('size', filter.itemsPerPage);  

    if (filter.nome) {  
      params = params.set('nome', filter.nome); 
    }

    console.log(params);

    return this.http.get<IApiResponse<Arquivo>>(`${this.arquivosUrl}`, { params });
  }

  delete(filename: string): Observable<void> {
    return this.http.delete<void>(`${this.arquivosUrl}/${filename}`, { });
  }
  
}
