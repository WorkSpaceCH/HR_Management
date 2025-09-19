import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Generic GET method
   * @param path API endpoint path
   * @param params Optional query parameters
   * @returns Observable of the response
   */
  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, { params });
  }

  /**
   * Generic POST method
   * @param path API endpoint path
   * @param body Request body
   * @returns Observable of the response
   */
  post<T, D>(path: string, body: D): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body);
  }

  /**
   * Generic PUT method
   * @param path API endpoint path
   * @param body Request body
   * @returns Observable of the response
   */
  put<T, D>(path: string, body: D): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body);
  }

  /**
   * Generic PATCH method
   * @param path API endpoint path
   * @param body Request body
   * @returns Observable of the response
   */
  patch<T, D>(path: string, body: D): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${path}`, body);
  }

  /**
   * Generic DELETE method
   * @param path API endpoint path
   * @returns Observable of the response
   */
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${path}`);
  }
}
