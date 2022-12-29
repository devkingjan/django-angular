import { Injectable } from '@angular/core';
import { RequestParams } from './request-params';
import { Observable } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
// import 'rxjs/add/observable/throw';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {MeService} from '../services/me.service';
@Injectable()
export class RequestService {
  get apiUrl(): string {
    return environment.apiUrl;
  }
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private me: MeService) { }

  observableFact(requestParams: RequestParams): Observable<any> {
    const options: any = {};
    if (requestParams.requestAuth) {
        this.headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'JWT ' + this.me.token});
    }
    options.params = requestParams.requestParams;
    let httpRequest;
    if (requestParams.requestMethod === 'GET') {
      options.headers = this.headers;
      httpRequest = this.http.get(`${this.apiUrl}/${requestParams.requestUrl}`, options);
    } else if (requestParams.requestMethod === 'POST') {
      if (requestParams.requestFile) {
        httpRequest = this.http.post(
          `${this.apiUrl}/${requestParams.requestUrl}`,
          requestParams.requestFile,
          options,
        );
      } else {
        options.headers = this.headers;
        httpRequest = this.http.post(
        `${this.apiUrl}/${requestParams.requestUrl}`,
        JSON.stringify(requestParams.requestPayload),
        options,
        );
      }
    } else if (requestParams.requestMethod === 'PUT') {
      options.headers = this.headers;
      httpRequest = this.http.put(
        `${this.apiUrl}/${requestParams.requestUrl}`,
        JSON.stringify(requestParams.requestPayload),
        options,
      );
    } else if (requestParams.requestMethod === 'DELETE') {
      options.headers = this.headers;
      httpRequest = this.http.delete(`${this.apiUrl}/${requestParams.requestUrl}`, options);
    }
    // httpRequest = httpRequest.pipe(
    //   map(response => {
    //     response.json();
    //   }),
    // )
    return httpRequest;
  }

  get(): RequestParams {
    return new RequestParams(p => this.observableFact(p)).get();
  }

  post(): RequestParams {
    return new RequestParams(p => this.observableFact(p)).post();
  }

  put(): RequestParams {
    return new RequestParams(p => this.observableFact(p)).put();
  }

  delete(): RequestParams {
    return new RequestParams(p => this.observableFact(p)).delete();
  }

}
