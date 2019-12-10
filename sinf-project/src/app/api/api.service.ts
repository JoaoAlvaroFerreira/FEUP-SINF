import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MessageService } from '../message.service';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  get(ep) {
   
    return this.http.get(`${environment.url}/${environment.account}/${environment.subscription}${ep}`,
    {
    headers: new HttpHeaders({
      Authorization: `${localStorage.getItem('primaveraToken')}`
    })
  })
}

post(ep, body) {
  return this.http.post<Object>(`${environment.url}/${ep}`,body,
  {
  headers: new HttpHeaders({
    Authorization: localStorage.getItem('primaveraToken')
  })
});
}
  
  getTokenFromJasmn(){

   
    var formData: any = new FormData();
    
    formData.append("client_id",environment.client_id);
    formData.append("client_secret",environment.client_secret);
    formData.append("scope",environment.scope);
    formData.append("grant_type",environment.grant_type);
  
    
    return this.http.post(
      environment.proxyurl+environment.tokenUrl,formData
    ).pipe(retry(2),tap(
      (response: any) => localStorage.setItem('primaveraToken', `Bearer ${response.access_token}`)
    ));
  }
  getTokenFromJasmin() {
   // localStorage.setItem('primaveraToken', `Bearer `);
   //localStorage.removeItem('primaveraToken');
   var formData: any = new FormData();
    
   formData.append("client_id",environment.client_id);
   formData.append("client_secret",environment.client_secret);
   formData.append("scope",environment.scope);
   formData.append("grant_type",environment.grant_type);

    return this.http.post(
      environment.proxyurl+environment.tokenUrl,formData
    ).subscribe(
     (response: any) => localStorage.setItem('primaveraToken', `Bearer ${response.access_token}`)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };


}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/