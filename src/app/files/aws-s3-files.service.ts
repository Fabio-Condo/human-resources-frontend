import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { S3Object } from "../core/model/S3Object";
import { IS3ObjectFilter } from "../core/interfaces/IS3ObjectFilter";
import { IS3OjectsResponse } from "../core/interfaces/IS3OjectsResponse";
import { IS3UploadResponse } from "../core/interfaces/IS3UploadResponse";

@Injectable({ providedIn: 'root' })
export class AwsS3FilesService {

    arquivosUrl: string;

    constructor(private http: HttpClient) {
        this.arquivosUrl = `${environment.apiUrl}/files`;
    }

    getFiles(filter: IS3ObjectFilter): Observable<IS3OjectsResponse<S3Object>> {

        let params = new HttpParams()
            .set('maxKeys', filter.maxKeys)

        if (filter.prefix) {
            params = params.set('prefix', filter.prefix);
        }

        //if (filter.continuationToken) {  
        //    params = params.set('continuationToken', filter.continuationToken); 
        //}

        //if (filter.nextContinuationToken) {  
        //    params = params.set('nextContinuationToken', filter.nextContinuationToken); 
        //}

        console.log(params);

        return this.http.get<IS3OjectsResponse<S3Object>>(`${this.arquivosUrl}`, { params });
    }

    download(filename: string): Observable<Blob> {
        return this.http.get(`${this.arquivosUrl}/${filename}`, { responseType: 'blob' });
    }

    delete(filename: string): Observable<void> {
        return this.http.delete<void>(`${this.arquivosUrl}/${filename}`, {});
    }

    uploadFile(file: File): Observable<IS3UploadResponse> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post<IS3UploadResponse>(`${this.arquivosUrl}`, formData);
    }

    deleteFiles(fileKeys: string[]): Observable<string> {
        return this.http.post<string>(`${this.arquivosUrl}/multiple`, fileKeys, { });
    }
    
}