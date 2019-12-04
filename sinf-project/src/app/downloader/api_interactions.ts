import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiInteractions {
  private http: HttpClient;
  constructor() { }

  //example of endpoint: GET /sales/orders
  
  get(endpoint: string) : Observable<Object> {
    return this.http.get(
      'https://my.jasminsoftware.com/api/224992/INDUSTRIA20SINF2019/'+endpoint,
      {
        headers: new HttpHeaders({
          Authorization: 'industria20sinf2019',
          'Content-Type': 'application/json'
        })
      }
    );
  }
  
  post(endpoint: string, body: any) : Observable<Object> {
    return this.http.post(
      'https://my.jasminsoftware.com/api/224992/INDUSTRIA20SINF2019/'+endpoint,
      body,
      {
        headers: new HttpHeaders({
          Authorization: 'industria20sinf2019',
          'Content-Type': 'application/json'
        })
      }
    );
  }

}
