import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequestData } from './http.models';
import { Observable, throwError } from 'rxjs';
import { API_URL } from './http.consts';
import { Store } from '@pm-store/store';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient, private store: Store) {}

  request<Response>(
    reqParams: HttpRequestData,
    body: any = '',
    urlParam: string = '',
    urlQuery: string = '',
    handleErros: boolean = true
  ): Observable<Response> {
    let reqUrl = API_URL + reqParams.url.replace(':param', urlParam) + urlQuery;

    const headers = this.getHeaders(handleErros, reqParams.optional);

    switch (reqParams.method) {
      case 'POST':
        return this.postHttp(reqUrl, body, headers);
      case 'GET':
        return this.getHttp(reqUrl, headers);
      case 'DELETE':
        return this.deleteHttp(reqUrl, headers);
      case 'PUT':
        return this.putHttp(reqUrl, body, headers);
      case 'PATCH':
        return this.patchHttp(reqUrl, body, headers);
      default:
        return throwError(() => 'Method is not defined');
    }
  }

  private postHttp<Response>(
    url: string,
    data: Record<string, any>,
    headers?: HttpHeaders
  ) {
    return this.http.post<Response>(url, data, {
      headers,
    });
  }

  private getHttp<Response>(url: string, headers?: HttpHeaders) {
    return this.http.get<Response>(url, {
      headers,
    });
  }

  private putHttp<Response>(
    url: string,
    data: Record<string, any>,
    headers?: HttpHeaders
  ) {
    return this.http.put<Response>(url, data, {
      headers,
    });
  }

  private deleteHttp<Response>(url: string, headers?: HttpHeaders) {
    return this.http.delete<Response>(url, {
      headers,
    });
  }

  private patchHttp<Response>(
    url: string,
    data: Record<string, any>,
    headers?: HttpHeaders
  ) {
    return this.http.patch<Response>(url, data, {
      headers,
    });
  }

  private getHeaders(
    handleErrors: boolean = false,
    authOptional: boolean = false
  ) {
    const headers: Record<string, string> = {};

    if (!handleErrors) {
      headers['no-handle-error'] = 'true';
    }

    if (authOptional) {
      headers['auth-optional'] = 'true';
    }

    return new HttpHeaders(headers);
  }
}
