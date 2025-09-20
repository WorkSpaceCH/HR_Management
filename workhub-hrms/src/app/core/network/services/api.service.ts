import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

/**
 * ApiService - Central service for making HTTP requests
 * All API calls should go through this service to ensure consistent handling
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl || '/api';
  
  constructor(private http: HttpClient) {}
  
  /**
   * Make a GET request
   * @param path The API endpoint path
   * @param params Optional query parameters
   * @param customHeaders Optional additional headers
   */
  get<T>(path: string, params?: any, customHeaders?: HttpHeaders): Observable<T> {
    const options = this.createRequestOptions(params, customHeaders);
    // Using type assertion to resolve the type issue
    return this.http.get<T>(`${this.apiUrl}/${path}`, options) as Observable<T>;
  }
  
  /**
   * Make a POST request
   * @param path The API endpoint path
   * @param body The body of the request
   * @param params Optional query parameters
   * @param customHeaders Optional additional headers
   */
  post<T>(path: string, body: any, params?: any, customHeaders?: HttpHeaders): Observable<T> {
    const options = this.createRequestOptions(params, customHeaders);
    // Using type assertion to resolve the type issue
    return this.http.post<T>(`${this.apiUrl}/${path}`, body, options) as Observable<T>;
  }
  
  /**
   * Make a PUT request
   * @param path The API endpoint path
   * @param body The body of the request
   * @param params Optional query parameters
   * @param customHeaders Optional additional headers
   */
  put<T>(path: string, body: any, params?: any, customHeaders?: HttpHeaders): Observable<T> {
    const options = this.createRequestOptions(params, customHeaders);
    // Using type assertion to resolve the type issue
    return this.http.put<T>(`${this.apiUrl}/${path}`, body, options) as Observable<T>;
  }
  
  /**
   * Make a PATCH request
   * @param path The API endpoint path
   * @param body The body of the request
   * @param params Optional query parameters
   * @param customHeaders Optional additional headers
   */
  patch<T>(path: string, body: any, params?: any, customHeaders?: HttpHeaders): Observable<T> {
    const options = this.createRequestOptions(params, customHeaders);
    // Using type assertion to resolve the type issue
    return this.http.patch<T>(`${this.apiUrl}/${path}`, body, options) as Observable<T>;
  }
  
  /**
   * Make a DELETE request
   * @param path The API endpoint path
   * @param params Optional query parameters
   * @param customHeaders Optional additional headers
   */
  delete<T>(path: string, params?: any, customHeaders?: HttpHeaders): Observable<T> {
    const options = this.createRequestOptions(params, customHeaders);
    // Using type assertion to resolve the type issue
    return this.http.delete<T>(`${this.apiUrl}/${path}`, options) as Observable<T>;
  }
  
  /**
   * Create the options object for HTTP requests
   */
  private createRequestOptions(params?: any, customHeaders?: HttpHeaders): any {
    const options: any = {};
    
    if (params) {
      let httpParams = new HttpParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
      
      options.params = httpParams;
    }
    
    if (customHeaders) {
      options.headers = customHeaders;
    }
    
    return options;
  }
}
