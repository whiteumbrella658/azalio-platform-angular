import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { config } from '../../../environments/configuration';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = config.BE_URL;
  //  this.baseURL = 'http://192.168.19.184:3000/api/'; //office
  //  this.baseURL = 'http://localhost:3000/api/';
   //  this.baseURL = 'https://azal-test-be.mybluemix.net/api/';
  }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${this.baseURL}${path}`, { params }).pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    const reqheader = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseURL}${path}`, JSON.stringify(body), { headers: reqheader }).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    const reqheader = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseURL}${path}`, JSON.stringify(body), { headers: reqheader }).pipe(catchError(this.formatErrors));
  }

  patch(path: string, body: Object = {}): Observable<any> {
    const reqheader = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch(`${this.baseURL}${path}`, JSON.stringify(body), { headers: reqheader }).pipe(catchError(this.formatErrors));
  }

  delete(path: string): Observable<any> {
    const reqheader = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(`${this.baseURL}${path}`, { headers: reqheader }).pipe(catchError(this.formatErrors));
  }

  fileUpload(path: string, body: Object = {}): Observable<any> {
    const reqheader = new HttpHeaders();

    return this.http.post(`${this.baseURL}${path}`, body, { headers: reqheader }).pipe(catchError(this.formatErrors));
  }

  // getExternal(path: string, params: HttpParams = new HttpParams()): Observable<any> {
  //   return this.http.get(`${path}`, { params })
  //   .pipe(catchError(this.formatErrors));
  // }

  getExternal(url) {
    let reqheader = new HttpHeaders({ 'Content-Type': 'application/json' });
    reqheader = reqheader.append('skipAuth', 'true');
    return this.http.get(url, { headers: reqheader });
  }

  getImage(url) {
    let reqheader = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(url, { headers: reqheader, responseType: 'blob' });
  }

  getPdfFile(url) {
    const timestamp = new Date().getTime();
    let reqheader = new HttpHeaders( {'Time-Stamp': timestamp.toString()} );
    return this.http.get(this.baseURL + url, { headers: reqheader, responseType: 'text' });
  }

  getSharedScheduler(path) {
    let reqheader = new HttpHeaders({ 'Content-Type': 'application/json' });
   // this.baseURL='https://azal-test-be.mybluemix.net/api/';
    reqheader = reqheader.append('sharedToken', 'true');
    return this.http.get(`${this.baseURL}${path}`, { headers: reqheader });
  }

  getSharedToken(path: string, token: string): Observable<any> {
    let reqheader = new HttpHeaders({ 'Content-Type': 'application/json' });
    //this.baseURL='https://azal-test-be.mybluemix.net/api/';
   reqheader = reqheader.append('token', token);
   reqheader = reqheader.append('sharedToken', 'true');
     return this.http.get(`${this.baseURL}${path}`, { headers: reqheader });
  }
}
