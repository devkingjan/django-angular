import * as _ from 'lodash';
import { Observable } from 'rxjs';
// import 'rxjs/add/operator/toPromise';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

function buildUrl(urlTempl: string, params: string[]) {
  const
  chunks = urlTempl.split('{}');

  let url = '';
  chunks.forEach((c, i) => {
    url += c;
    if (i < params.length) {
      url += encodeURIComponent(params[i]);
    }
  });
  return url;

}

export class RequestParams {
  requestMethod: Method;
  requestUrl: string;
  requestPayload: any;
  requestFile: any;
  requestParams: any;
  requestAuth: boolean;

  constructor(private observableFact: (r: RequestParams) => Observable<any>) {
    this.requestParams = {};
    this.requestAuth = false;
  }

  get(): RequestParams {
    this.requestMethod = 'GET';
    return this;
  }

  post(): RequestParams {
    this.requestMethod = 'POST';
    return this;
  }

  put(): RequestParams {
    this.requestMethod = 'PUT';
    return this;
  }

  delete(): RequestParams {
    this.requestMethod = 'DELETE';
    return this;
  }

  url(urlTempl: string, ...params: string[]) {
    this.requestUrl = buildUrl(urlTempl, params);
    return this;
  }

  params(params: any): RequestParams {
    _.assign(this.requestParams, params);
    return this;
  }

  filter(params: any): RequestParams {
    for (const propName in params) {
      if (params[propName] === null || params[propName] === undefined) {
        delete params[propName];
      }
    }
    return this.params({filter: JSON.stringify(params)});
  }

  payload(payload: any): RequestParams {
    this.requestPayload = payload;
    return this;
  }

  sort(field: string, desc: boolean = false): RequestParams {
    if (desc) {
      field = '-' + field;
    }
    return this.params({sort: field});
  }

  page(page: number): RequestParams {
    return this.params({page: page});
  }
  per_page(per_page: number): RequestParams {
    return this.params({per_page: per_page});
  }
  all(): RequestParams {
    return this.params({o_all: 'true'});
  }

  auth(): RequestParams {
    this.requestAuth = true;
    return this;
  }

  file(file: any): RequestParams {
    this.requestFile = file;
    return this;
  }

  promise(): Promise<any> {
    return this.observableFact(this).toPromise();
  }

  observable(): Observable<any> {
    return this.observableFact(this);
  }

}
