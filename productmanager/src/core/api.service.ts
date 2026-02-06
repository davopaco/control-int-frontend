import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private prefixPath = environment.apiUrl;
  private headers: any = {
    'Content-Type': 'application/json',
  };

  constructor(private http: HttpClient) {}

  public get<T>(url: string, params?: HttpParams) {
    return this.http.get<T>(`${this.prefixPath}/${url}`, {
      headers: this.headers,
      params,
    });
  }

  public post(url: string, body: any) {
    return this.http.post(`${this.prefixPath}/${url}`, body, {
      headers: this.headers,
    });
  }

  public put(url: string, body: any, params?: HttpParams) {
    return this.http.put(`${this.prefixPath}/${url}`, body, {
      headers: this.headers,
      params: params,
    });
  }

  public delete(url: string) {
    return this.http.delete(`${this.prefixPath}/${url}`, {
      headers: this.headers,
    });
  }
}
